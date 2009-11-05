---
  title: "Berlin droidcamp roundup"
  published: true
---

<img src="/images/droid_camp150.jpg" alt="droidcamp logo" class="left-img" height="150" width="150"/>

I went to the first Android-focused barcamp ([droidcamp](http://androidcamp-berlin.mixxt.de/)) which took place in Berlin-Dahlem last week. It was organised in conjunction with the more formal [droidcon](http://www.droidcon.de/), which happened the next day, at the same location. From what I gathered the entrance fees for droidcon partially subsidised the barcamp, an interesting concept.

There was a great interest in droidcamp beforehand, most of the tickets were snapped up in the first hour after registration opened. Luckily another 50 tickets were made available shortly afterwards, resulting in a total number of attendees of around 200. 

I was expecting the barcamp to be a mostly German-dominated event but was proven wrong - the introduction round was done in English and there were indeed quite a few people travelling from abroad to attend. Consequently most sessions were done in English, with the odd exception.

##Sessions##

The quality of sessions ([overview](http://androidcamp-berlin.mixxt.de/networks/wiki/index.droidcamp%20Session)) was quite high - a mix of code and app marketing related talks, except for two pitch sessions, held by sponsors. The first talk I went to see was "Music creation for Android" by Alex Shaw, who demonstrated his synthesiser built using the NDK (native development kit). Compared to the huge selection on the iPhone music related applications on Android are still quite rare, so it was good to see someone working on Android music projects.

Next one up was "OpenStreetMap on Android" which gave an overview of the different libraries and apps using OSM data. For example there is [osmdroid](http://code.google.com/p/osmdroid/) which aims to provide a free replacement for Google's MapView class. I was particularly interested in the offline capabilities, a huge advantage over Google's solution which always requires you to be connected to the Internet.

The web widget development talk (Jo Ritter) made it clear in what a mess the widget standardisation process is in at the moment - there are at least three different "standards" being worked on, all in different states of completion. It's probably best to wait a while before any sort of merging happens.

Carl Harroch presented [RESTProvider](http://github.com/novoda/RESTProvider), an interesting framework to consume REST services using Android's ContentProvider API.

Afterwards Stefan Alund gave an early look at the DroidPush API ([slides](http://www.slideshare.net/StefanAlund/an-early-look-at-droidpush-api-a-push-api-for-android)), currently being developed at Ericsson.

My talk was next, with the aim to convince attendees of Scala's merits for Android development ([slides](http://www.slideshare.net/janberkel/android-development-with-scala)). I think I managed to confuse some people with a mostly code snippet-based presentation, but still got a couple of interesting questions afterwards. It seems that developers are mostly concerned about tool support (i.e. full integration in Eclipse) and performance / memory consumption issues, so it would be good to do some research and profiling with a real application (there aren't many at the moment). The DalvikVM is quite a different beast, so some optimisations in Scala geared towards the JVM might not be applicable there.

The last session I attended was an open discussion about the state of open source projects on Android, hosted by Friedger Müffke. Google's open source credibility has suffered a bit recently when they sent a "cease and desist" letter to the developer of [cyanogen](http://www.cyanogenmod.com/), a popular firmware replacement (it included some closed source apps). Apparently the community is now working on open source replacements for some of those components.

Unfortunately I missed two interesting looking sessions, both gaming related: [urban golf](http://urbangolf.ignaz.at/) and [Mister X goes Android](http://www.droidcon.de/de/programm-conf/29-mister-x-goes-android-a-location-based-multiplayer-game?tmpl=component), a location-based game which got talked a lot about during the barcamp.

##Summary##

It was great barcamp, very well-run and with lots of interesting attendees and sessions. There definitely is a big interest in Android right now, and a common talking point amongst attendees was the notion that Android will "really take off" in 2010. Here's another list of "[hot topics](http://www.networkworld.com/community/node/47137)".

