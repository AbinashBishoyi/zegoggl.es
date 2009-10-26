---
  title: "Developing on Android"
---

<img src="/images/android_skate.png" alt="Android Market" class="left-img" height="90" width="90"/>

A couple of months ago I realised that I got a bit bored with web development and decided to try something new. Lots of interesting stuff seemed to happen in the mobile development sector, mainly driven by the huge success of Apple's iPhone platform. At a London hackspace meetup I finally got to play with one of the first Android phones, a G1 (also known as HTC Dream) and was impressed: it certainly lacked the elegance and polish of an Apple product, but the platform looked promising. I decided to get started on Android mainly for two reasons: firstly, it's an open platform built on open source technology which makes it a lot easier to hack on. This applies to the application distribution channel (Android Market) as well, where applications don't need to be approved before they can be installed. In fact it's even possible to bypass the Market completely and install apps directly from a website. Compare that to Apple's mysterious and not very transparent approval "policies".

Secondly, as the platform is still quite young there's a potential for early adopters to build interesting things as the market is not completely saturated.

What follows is a mini-review, highlighting the good & bad points from my perspective. 

## The bad stuff
### Usability

<img src="/images/android_market.png" alt="Android Market" class="right-img"/>

While Android's inner workings might be well engineered, Google sucks at user experience design. For example, in the Android Market you can browse through a list of featured applications by sliding your finger over the display. The name of the focused application is located under the row of icons, exactly where you're finger is normally placed to scroll through the list, making it very cumbersome to use. Why not just put it above the icons so you can read it while you browse ? 

The Android Market, the main place to install new software and therefore quite an important application is pretty crap. Apps are listed in completely useless or arbitrary categories (Health, Lifestyle, Productivity) and don't provide any screen shots. The text-based search interface is rudimentary (no spelling suggestion, only exact queries will match), quite embarrassing for a company like Google which should know how to implement good search functionality.   

The most recent version of the SDK (1.6, still in developer beta) addresses at least some of these issues: [Android Market Updates in 1.6](http://developer.android.com/sdk/android-1.6-highlights.html#AndroidMarketUpdates).

### Performance

Android has its own custom JVM implementation called Dalvik, which is heavily optimised for mobile devices (low memory footprint, process isolation). Unfortunately it doesn't support JIT or AOT compilation at the moment (although they have stated
"[We do plan to include JIT and/or AOT compilation in a future release"](http://groups.google.com/group/android-framework/browse_thread/thread/bef4f5f588aef15f)).

This might not be a problem for simple apps like TODO lists etc. but don't expect anything CPU intensive to run smoothly on this device. I tried to port [jsidplay](http://jsidplay2.sourceforge.net/) (a Java library which emulates SID, the sound chip used in the old Commodore 64) to Android and quickly gave up after listening to the first results, it was just too slow and produced choppy playback.

Similarly the [JavaGB](https://sourceforge.net/projects/javagb/) project (open source Java Game Boy emulator) abandoned the Android version because of the missing JIT compilation.

So in the meantime the only way to get reasonable performance out of Android is to go native (C/C++) using the [Android NDK](http://developer.android.com/sdk/ndk/1.5_r1/index.html), which ultimately means trading ease of development for speed.

### Building everything from source

I've already mentioned that the whole platform being released as open source (Apache Software License) was one of the reasons why I picked Android over other systems. So one of the first things I tried after getting my Google dev phone was to replace the pre-installed firmware with a new version entirely compiled from source, following the instructions ("[Building For Dream](http://source.android.com/documentation/building-for-dream)"). It turns out that it's actually very difficult to produce a usable image which is comparable to the one shipped with the device, binary drivers need to be extracted from the phone and the build process itself is very complicated.

### No Multitouch

By default Android doesn't support multitouch gestures. Apparently there is support for it in the codebase but it got disabled on Apple's request (legal/patent issues?). There are some unofficial firmwares floating around which re-enable it, but I haven't actually tried them out.

### Gdata api integration

While applications shipped with Android phones integrate well with Google's different services (GMail, GCalendar) the situation looks bad from a developer's perspective: the SDK doesn't contain Java APIs to access Google's services programmatically, you have to roll your own.

## The good stuff
### polyglot programming

Although Dalvik uses its own bytecode format and has no support for JIT yet, it still opens up a lot of possibilities for developing Android applications in languages other than Java. I'm planning to use Scala for my first Android project and a proof of concept looks promising so far: [Hello World in Scala on Android](http://github.com/jberkel/android-helloworld-scala).

JRuby project lead Charles Nutter is working on getting JRuby fully supported on Android (project [Ruboto](http://blog.headius.com/2009/08/return-of-ruboto.html)) and some people even tinker with Clojure, a modern implementation of Lisp on the JVM ([github.com/remvee/clojure](http://github.com/remvee/clojure/tree/1.0.x-dalvik)).

Not JVM based, but still interesting is the Android Scripting Environment ([ASE](http://code.google.com/p/android-scripting/)), a project aiming to make scripting languages available for application development. At the moment it supports Python, Perl, Lua and BeanShell.

### api/architecture design 

Overall the API is reasonably well designed. One part of it stands out: the [Intent/Activity](http://developer.android.com/reference/android/content/Intent.html) model. The idea behind intents is to make some parts of applications callable from other programs, often to perform specific tasks. The barcode scanner application [ZXing](http://code.google.com/p/zxing/) is a good example. Say you wanted to integrate some barcode reading functionality in your own application, instead of linking and bundling it with your code you can request the scan from an already installed application as follows:

<pre>
  <code class="java">
    Intent intent = new Intent("com.google.zxing.client.android.SCAN");
    intent.putExtra("SCAN_MODE", "QR_CODE_MODE");
    startActivityForResult(intent, 0);
  </code>
</pre>

This will launch the barcode application in scan mode (if not already running), and transfer control back to your handler method after the scan is completed:

<pre>
  <code class="java">
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
      if (requestCode == 0) {
          if (resultCode == RESULT_OK) {
              String contents = intent.getStringExtra("SCAN_RESULT");
              String format = intent.getStringExtra("SCAN_RESULT_FORMAT");
              // Handle successful scan
          } else if (resultCode == RESULT_CANCELED) {
              // Handle cancel
          }
      }
    }
  </code>
</pre>

It's a move away from monolithic, isolated applications, and a big step ahead of the current iPhone programming model. The [Open Intents](http://www.openintents.org/en/intentstable/) project aims to provide a registry for reusable intents which can be used by other applications.

### Good tool support

The SDK ships with a lot of tools, my favourite is the Dalvik Debug Monitor Service (DDMS), see screenshot below.

<img src="/images/android_ddms.png" width="100%" alt="ddms" class="right-img"/>

It lets you monitor pretty much everything happening on a running device (or emulator), CPU load, memory allocation, logging output etc.

Android projects are by default built using ant, but it's very easy to use Rake instead ([Andrake](http://github.com/remi/andrake/), [hello world with rake](http://github.com/jberkel/android-helloworld-rake)). If you prefer developing in an IDE, there are plugins available for the most common ones
([Intellij IDEA](http://code.google.com/p/idea-android/), [Eclipse](http://source.android.com/using-eclipse), [Netbeans](http://kenai.com/projects/nbandroid)).

### Community

There is a growing hacker community around Android and Google now tries to encourage developers to contribute to the codebase.    [CyanogenMod](http://www.cyanogenmod.com/) is an example of a custom firmware with an optimised kernel and various other enhancements. I'm hopeful that the open nature of
Android itself motivates more developers to build a rich infrastructure of open source projects around the platform, similar to Linux. At the moment most applications in the Android Market are available for free (but not necessarily open source), although that might change as the user base grows.

## Conclusion

With more Android phones arriving in the next few months there is a good chance that the platform will become the second player after Apple in the mobile market, but there are obviously quite a few rough edges which need sorting out. The potential is clearly there.





