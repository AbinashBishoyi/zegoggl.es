---
  title: Jekyll vs Marley
---

I really tried to like [marley](/2009/03/setting-up-marley.html), but in the
end it turned out to be quite painful, especially the deployment process with
passenger. [Jekyll](http://github.com/mojombo/jekyll/) is the new kid on the
block and can hardly be called a "blog engine". It's a minimalist blog aware static site
generator (remember those?), written by Tom Preston-Werner of github fame (it
also powers the [github pages](http://github.com/blog/272-github-pages)).

Although 'static site generator' sounds more like 1999 than 2009, there're a couple
of reasons you might want to use one:

  * text can be stored in a VCS, no database needed
  * deployment machine needs no extra dependencies, only a web server (rsync is your friend)
  * some dynamic parts of the site like comments can be delegated to javascript, for
example [disqus](http://disqus.com), a hosted service
  * it's fast and secure

My main problem with jekyll so far has been that it uses liquid as templating
language. Fortunately [Henrik Nyh](http://henrik.nyh.se) has forked the project
and hacked haml support into it, check out [github.com/henrik/jekyll](http://github.com/henrik/jekyll).

I really like it so far, no more deployment headaches, and local development is
a breeze with auto-regeneration of pages and the integrated webrick support.

There's another review on
[oiledmachine.com](http://www.oiledmachine.com/posts/2008/12/27/overview-of-jekyll--a-static-site-generator-written-in-ruby.html)
if you want to know more and a port called [hyde](http://github.com/lakshmivyas/hyde/), for those who prefer python.

Update (19/09/09):

Henrik's fork of jekyll is slightly out of date, if you want to use haml with a more recent version of jekyll (0.5.4 at the moment) use my fork instead: [github.com/jberkel/jekyll](http://github.com/jberkel/jekyll/), also installable as a gem:

<pre>
  <code class="bash">
  $ gem sources -a http://gems.github.com
  $ sudo gem install jberkel-jekyll
  </code>
</pre>