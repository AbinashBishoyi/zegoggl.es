---
  title: "Generating dynamic playlists with spotify-api"
  published: true
---

It's been a while since I released [spotify-api](/2009/08/build-your-own-spotify-api.html), a homegrown implementation of a restful API to the Spotify music service. Now that the API is getting to a usable state I decided to build some applications on top of it.

## What music do your friends love?

My goal was to automatically create some Spotify playlists with interesting or personalised content. On Last.fm there is a concept of loved tracks, where a user can tag songs they like. So, if you share a similar music taste with your friends on last.fm you can easily create a good playlist by taking all the recently loved tracks from your friends and convert them into a Spotify playlist.

<img src="/images/lastfm_loved.png" alt="last.fm loved tracks" class="right-img"/>

What you get is a "socially filtered" playlist, hopefully with some good music friends would recommend to you anyway. Another option would be to take recently loved tracks by your last.fm neighbours, but that relies more on  algorithms used by Last.fm than trust (but which could still produce interesting results).

Here's the code for code for generating those playlists:
[lastfm2spotify_loved_tracks](http://github.com/jberkel/spotify-api/blob/master/examples/lastfm2spotify_loved_tracks), you'll need a Last.fm API key as well as a premium Spotify account to use it.

## What music do people listen to in other cities?

<img src="/images/citysounds_fm.png" alt="citysounds.fm" class="left-img"/>

I really like the [citysounds.fm](http://citysounds.fm/) mashup, which uses music and data from [soundcloud](http://soundcloud.com) to give you an idea what styles of music gets produced in different cities across the world.

Last.fm have recently added some functionality to their API which let you grab music charts by location ([New Geo Services: Metro Charts](http://www.last.fm/group/Last.fm+Web+Services/forum/21604/_/573474)).

The difference here is that citysounds.fm provides you with music produced in different cities, whereas the Last.fm data is music consumed in those cities. 

Here are some Spotify playlists produced from this data:

  * [Berlin](http://open.spotify.com/user/jberkel/playlist/5wDE3xVpeWcK8FeMlOX1Fd)
  * [London](http://open.spotify.com/user/jberkel/playlist/2ZxEiHIHSqdD5lfe1vL55u)
  * [Paris](http://open.spotify.com/user/jberkel/playlist/6gPNqHgUy1WHGPv1EOu8fj)
  * [Barcelona](http://open.spotify.com/user/jberkel/playlist/6wlJT0JIxTd442iyqJthzP)
  * [Rome](http://open.spotify.com/user/jberkel/playlist/06Qk4wprWzCbuT2Wo07hMa)
  * [Istanbul](http://open.spotify.com/user/jberkel/playlist/0W5j7QYpSzlawL53pU9qdI)
  * [Oslo](http://open.spotify.com/user/jberkel/playlist/5QVKKTC7usflPRDRdYsy02)
  * [Montreal](http://open.spotify.com/user/jberkel/playlist/3mD3gCGFHj39xa3uJiXKkF)
  * [Auckland](http://open.spotify.com/user/jberkel/playlist/3sAbXOeu03eT3s4gBS08wi)
 
I used the [getMetroUniqueTrackChart](http://www.last.fm/api/show?service=425) API method to obtain the tracks, which is meant to return tracks uniquely popular in a city. This kind of works, although there are still some tracks present in most of the playlists ([The xx](http://www.last.fm/music/The+XX) seem to be everywhere!) it generates some unique & local tracks. The Berlin playlist has a good share of local techno ([Paul Kalkbrenner](http://www.last.fm/music/Paul+Kalkbrenner)), Paris is quite heavy on French productions such Air and [Vitalic](http://www.last.fm/music/Vitalic), and Auckland has a lot of [Ladyhawke](http://www.last.fm/music/Ladyhawke) and [Fat Freddy's Drop](http://www.last.fm/music/Fat+Freddy's+Drop), both hailing from Wellington.

The Rome and Barcelona playlists both have quite a few Italian and Spanish songs in them, in fact the Rome playlist is mostly Italian. Oslo has a lot of Kings of Convenience and Röyksopp, and so on.

If you want to have a play yourself, the code to generate these playlists is in the spotify-api repo ([lastfm2spotify_metrochart](http://github.com/jberkel/spotify-api/blob/master/examples/lastfm2spotify_metrochart)). You might experience occasional timeouts using the API, it's not rock solid yet. Also make sure to check the [Spotify service status](http://www.spotify.com/en/help/service-status/) to verify that all services are working as expected.



  
