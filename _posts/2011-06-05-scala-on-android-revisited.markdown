---
  title: "Scala on Android Revisited"
  published: true
---
<img src="/images/gist-it.png" alt="gist-it" class="right-img"/>

It's been a while since I wrote about [Scala on Android][building...] - I'm still maintaining
and working on the [sbt-android-plugin][] but I haven't written any full-blown
apps with Scala. I started a project ([gigjet][]) but abandoned it after a
while (there were some Java-Scala interop problems, and a general lack of
motivation).

I checked and the initial commit on that project was almost two years ago - a lot of things
have changed since then, so I wanted to get an idea of the current situation by writing
a small but useful application with the goal of actually shipping some code
this time (= publishing it to the Android market).

The idea is simple - write an app to push [gists][gist] (snippets of text)
using the recently released version of the github API (which added write support for
the first time).

As I started to work on it I realised that a lot of things have changed - here
is a quick summary:

## Better tool support

When I first started with Scala it didn't have good IDE support - I use
Intellij IDEA for Java projects but their Scala support was very preliminary to
say the least.
Eclipse supposedly had a bit more to offer but is still, well, Eclipse so not really
an option for me. I ended up using vim which worked OK but didn't feel that
productive.

In the meantime the Scala core team has realised that tool
support is crucial for the wider adoption of the language and Martin Odersky
(Scala's designer) is working on (and dogfooding) the Eclipse plugin. I've read somewhere
that he was mostly using Emacs before - not something you can necessarily
assume from average [Java Joe][].

The Intellij Scala plugin is very functional and behaves mostly as you would
expect - it has some nice features like highlighting of implicit parameters which
is very useful. It also works well with the built-in Android support / facet -
there is support for logcat dumps, emulator integration, source code level
debugging etc.

The only downside is that compilation and syntax checking is very slow - the
syntax checker routinely lags a few seconds after making a couple of
edits, which can be very irritating. Compilation and packaging is also very slow -
[sbt][] with its powerful console mode is the better tool for that. I tend to
use IDEA for editing and refactorings and then just hit compile or package in
the sbt console.

If you're doing TDD both IDEA and sbt support most Scala test frameworks -
there is even an IDEA plugin for the (relatively) new [specs2][].

## Shaken, not stirred

One of the biggest drawbacks of using Scala on Android is the additional
required treeshake / proguard step. This is necessary to keep the app size down
since Scala has quite a big runtime library. Depending on the size of the
application and dependencies this can easily add an extra 30 seconds on top of
the normal build process which slows down the development cycle drastically.

However there is a way around that: you can [tweak the emulator][Tweaking the Android Emulator] 
to include predexed versions of the Scala runtime, which means you can
completely skip the proguard step during the (development) build. Together with sbt's
incremental compilation this makes for really fast build times, not much slower
compared to a standard Java build. Needless to say this makes a huge
productivity difference because you can iterate a lot faster.

## Growing up

Not only the tools but also Scala itself has matured over the last two years -
a few influential companies have started to adopt it, there are more libraries and open
source projects around to use and learn from. Many users regard the release of version
2.8 as Scala's "coming of age", it was often claimed that it should really have been called
3.0.

Most importantly it felt like a good fit for the project I was working on - at the
core of the app is the API integration with github which is naturally very
async and callback heavy - and Scala made that part easy.

As an example take the way asynchronous tasks are normally implemented in Android - you are
expected to subclass (!) [AsyncTask][] and override some methods in order to
provide callbacks:

<pre>
  <code class="java">
  class ApiTask extends AsyncTask&lt;Request, Void, HttpResponse&gt; {
      @Override public void onPreExecute() { ... }
      @Override public HttpResponse doInBackground(Request... args) {
        // actual work done here
      }
      @Override public void onPostExecute() { ... }
  }

  new ApiTask().execute(...);
   </code>
</pre>

With Scala you can just pass your callbacks directly as functions which is a
lot more elegant and less boilerplaty, here a simplified example taken from the
gist-it app:

<pre>
  <code class="scala">
  def executeApi(call: Request => HttpResponse, req: Request, expected: Int)
                (success: HttpResponse => Any)
                (error: Either[IOException,HttpResponse] => Any) {
    //...
  }
  </code>
</pre>

This defines a method which takes as parameters

  * a function which takes a request object and returns a HTTP response (`call`)
  * a request (`req`)
  * an expected HTTP status code (`expected`)
  * a success callback which gets passed the HttpResponse object (`success`)
  * an error callback which gets passed either an IOException or an
  HttpResponse object (`error`)

You can see that this does a lot more than the AsyncTask - it basically
abstracts a common API request (do this, expect this, return value, etc). The
client code just passes in all the necessary callbacks.

Another Scala feature which is very useful on Android are traits. I use traits
in a similar way Ruby modules can be used - to mix behaviour into existing
classes. The reason this is useful on Android is that the framework forces you
to inherit in a lot of places - your activities need to subclass `Activity`, your
views `View` and so on. This makes adding extra functionality a bit cumbersome
- you can add intermediate classes or use delegation.

With Scala you can encapsulate common behaviour in traits and then mix
them into your activities or views - you end up with smaller and more reusable
pieces of code, potentially even across different projects.

Again as a quick example a trait to perform the lookup of the current token
using Android's AccountManager API:

<pre>
  <code class="scala">
  case class Token(access: String)

  trait TokenHolder extends Context {
    lazy val accountType = getString(R.string.account_type)
    def account: Option[Account] =
      AccountManager.get(this).getAccountsByType(accountType).headOption

    def token: Option[Token] = account.map(a =>
      Token(AccountManager.get(this).getPassword(a)))
  }

  class MyActivity extends Activity with TokenHolder { ... }
  </code>
</pre>

The trait extends `Context` so you can use it with any Android context
(usually activities or your application instance). It also means the trait
itself has access to all methods provided by `Context`.

## The gist (sorry...)

<a href="https://market.android.com/details?id=com.zegoggles.gist">
  <img src="/images/gist-it-logo_128.png" alt="gist-it" class="left-img"/>
</a>

It's been fun to use Scala for this project - after some initial time spent on
getting everything set up I was immediately very productive. The app got finished
and released and has already some users.

You can find it in the [Android Market][gist-it] and the code on [github][].
Fork away if you have any ideas for new features!

So, what are Scala's chances in the wider Android ecosystem? There's no
official word from Google yet but Tim Bray (Android developer advocate) is
[very keen on supporting non-Java languages][Other Android Languages] on the
platform. More and more developers are interested in Android but not everybody
wants to use Java - Scala is an excellent alternative. A few success stories
here and there, a high profile Android app implemented in Scala would be a good
start.

There is now also a dedicated mailing list  ([scala-on-android][]) - still too small
to be called community but hopefully growing faster.

*Updated 17/06/2011:*

I'll add some links to relevant new blog posts as I find them:

  * [Scala: A Better Java for Android][]
  * [Scala’s Popularity on the Rise in Boston: sbt for Android][]
  * [How How we use Scala in Bump for Android][]


[sbt]: http://code.google.com/p/simple-build-tool/
[gist]: https://gist.github.com/
[building...]: http://zegoggl.es/2009/12/building-android-apps-in-scala-with-sbt.html
[sbt-android-plugin]: https://github.com/jberkel/android-plugin
[gigjet]: https://github.com/jberkel/gigjet
[Java Joe]: http://www.javalobby.org/java/forums/t77854.html
[Tweaking the Android emulator]: http://lamp.epfl.ch/~michelou/android/emulator-android-sdk.html
[AsyncTask]: http://developer.android.com/reference/android/os/AsyncTask.html
[gist-it]: https://market.android.com/details?id=com.zegoggles.gist
[github]: https://github.com/jberkel/gist-it
[specs2]: http://etorreborre.github.com/specs2/
[Other Android Languages]: http://www.tbray.org/ongoing/When/201x/2010/07/28/Ruby-and-Python-on-Android
[scala-on-android]: https://groups.google.com/group/scala-on-android

[Scala’s Popularity on the Rise in Boston: sbt for Android]: http://bostinnovation.com/2011/06/16/scalas-popularity-on-the-rise-in-boston-sbt-for-android/
[Scala: A Better Java for Android]: http://robots.thoughtbot.com/post/5836463058/scala-a-better-java-for-android
[How How we use Scala in Bump for Android]: http://devblog.bu.mp/how-we-use-scala-in-bump-for-android
