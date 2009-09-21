---
  title: "developing on android"
---

<img src="/images/android_skate.png" alt="Android Market" class="left-img" height="90" width="90"/>

A couple of months ago I realised that I got a bit bored with web development and decided to try something new. Lots of interesting stuff seemed to happen in the mobile development sector, mainly driven by the huge success of Apple's iPhone platform. At a London hackspace meetup I finally got to play with one of the first Android phones, a G1 (also known as HTC Dream) and was impressed: it certainly lacked the elegance and polish of an Apple product, but the platform looked promising. I decided to get started on Android mainly for two reasons: firstly, it's an open platform built on open source technology which makes it a lot easier to hack on. This applies to the application distribution channel (Android Market) as well, where applications don't need to be approved before they can be installed. In fact it's even possible to bypass the Market completely and install apps directly from a website. Compare that to Apple's mysterious and not very transparent approval "policies".

Secondly, as the platform is still quite young there's a potential for early adopters to build interesting things as the market is not completely saturated.

What follows is a mini-review, highlighting the good & bad points from my perspective. 


## The bad stuff
### Usability

<img src="/images/android_market.png" alt="Android Market" class="right-img"/>

While Android's inner workings might be well engineered, Google sucks at user experience design. For example, in the Android Market you can browse through a list of featured applications by sliding your finger over the display. The name of the focused application is located under the row of icons, exactly where you're finger is normally placed to scroll through the list, making it very cumbersome to use. Why not just put it above the icons ? Fail.

The Android Market, the main place to install new software and therefore quite an important application is unfortunately crap. Apps are listed in completely useless categories (Health ? Lifestyle ? Productivity ?) and don't provide any screen shots. The text-based search interface is rudimentary (no spell suggestion, only exact queries will match), quite embarrassing for a company like Google.   

The most recent version of the SDK (1.6, still in developer beta) addresses some of these issues: [Android Market Updates](http://developer.android.com/sdk/android-1.6-highlights.html#AndroidMarketUpdates).

### Performance

Android has its own custom JVM implementation called Dalvik, which is heavily optimised for mobile devices (low memory footprint, process isolation). Unfortunately it doesn't support JIT or AOT compilation at the moment (although they have stated
"[We do plan to include JIT and/or AOT compilation in a future release"](http://groups.google.com/group/android-framework/browse_thread/thread/bef4f5f588aef15f)).

This might not be a problem for simple apps like TODO lists etc. but don't expect anything CPU intensive to run smoothly on this device. I ported [jsidplay](http://jsidplay2.sourceforge.net/) to Android and quickly gave up after listening to the choppy playback.

Similarly the [JavaGB](https://sourceforge.net/projects/javagb/) project (open source Game boy emulator in Java) abandoned the Android version because of the missing JIT compiler.

In the meantime the only way to get reasonable performance out of Android is to go native, using the [Android NDK](http://developer.android.com/sdk/ndk/1.5_r1/index.html), which ultimately means trading speed for maintenance nightmares.

### Building from source

I've already mentioned that the whole platform being released as open source (Apache Software License, to be specific) was one of the reasons why I picked Android over other systems. So one of the first things I tried after getting my Google dev phone was to replace the pre-installed firmware with a new version entirely compiled from source, following the instructions ("[Building For Dream](http://source.android.com/documentation/building-for-dream)"). It turns out that it's actually very difficult to produce a usable image which is comparable to the one shipped with the device, binary drivers need to be extracted from the phone and the build process itself is very complicated.

<!-- ## Multitouch?

By default Android doesn't support multitouch gestures. Apparently it's in the code base but got disabled on Apple's request. There're some unofficial firmwares available to reenable it, but I haven't actually tried them out.

## Gdata API integration

While applications shipped with Android phones integrate well with Google's different services (GMail, GCalendar) the situation looks bad from a developer's perspective: there's no Java API to access Google's services programatically. -->

### Uncertain Future: Chrome

## The good stuff
### polyglot programming

Although Dalvik uses its own bytecode format and has no support for JIT yet, it still opens up a lot of possibilities for developing Android applications in languages other than Java. I'm using Scala for my first Android project and put a minimal demo app on github: [Hello World in Scala on Android](http://github.com/jberkel/android-helloworld-scala)

JRuby project lead Charles Nutter is working on getting JRuby fully supported on Android ([Ruboto](http://blog.headius.com/2009/08/return-of-ruboto.html)) and some people tinker with Clojure, a modern implementation of Lisp on the JVM ([github.com/remvee/clojure](http://github.com/remvee/clojure/tree/1.0.x-dalvik)).

Not JVM based, but still interesting is the Android Scripting Environment ([ASE](http://code.google.com/p/android-scripting/)), a project aiming to make scripting languages available for application development. At the moment it supports Python, Perl, JRuby, Lua and BeanShell.


### api/architecture design 

Overall the API is reasonably well designed. One part of it stands out: the Intent/Activity model. The idea behind intents is to make some parts of applications callable from other programs, often to perform specific tasks. The barcode scanner application [ZXing](http://code.google.com/p/zxing/) is a good example. Say you wanted to integrate some barcode reading functionality in your application, instead of linking it on compile-time you can request the scan from an already installed application as follows:

<pre>
  <code class="java">
    Intent intent = new Intent("com.google.zxing.client.android.SCAN");
    intent.putExtra("SCAN_MODE", "QR_CODE_MODE");
    startActivityForResult(intent, 0);
  </code>
</pre>

This will launch the barcode application (if not already running). After the scan is completed control is transferred back to your application by invoking a handler method:

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

It's a move away from monolithic, isolated applications, and a big step ahead of the current iPhone programming model. The [Open Intents](http://www.openintents.org/en/)) project aims to provide a registry for existing reusable intents.

### Background apps

Applications can run in the background on Android, which is a big advantage.

### Good tool support


<img src="/images/android_ddms.png" width="100%" alt="Android Market" class="right-img"/>


tool support: emulator, ddms,
[idea-android](http://code.google.com/p/idea-android/), eclipse, netbeans

### Community

active hacker community (custom firmwares, jf, [cyanogen](http://www.cyanogenmod.com/) ...)

Berlin conf, barcamp

