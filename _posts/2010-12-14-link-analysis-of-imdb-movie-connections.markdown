---
title: Link analysis of IMDB movie connections
published: true
---

## “Louis, I think this is the beginning of a beautiful friendship”

<a href="http://www.imdb.com/title/tt0034583/movieconnections">
  <img src="/images/imdb_casablanca_connections.png" alt="Casablanca" class="right-img"/>
</a>

The movie database IMDB is a great source of information, but there is one
aspect of it most people don't know about: most films have a "Connections"
section, which lists all references to other films (or TV series). What can be
considered a reference is pretty open: it could be a film poster visible in a
scene, or one of the characters uttering a well-known line from another film, e.g. "This
looks like the beginning of a beautiful friendship" in the screenshot.

The current IMDB dataset contains around 1 million of those references, far too many to
visualise or make sense of. So how could it be filtered, to only obtain
interesting references and films ?

Now, if you look at references as links between nodes (films) in a graph you
can apply existing algorithms like PageRank to obtain a ranking for each film,
similar to the way Google determines importance of web pages. An intentional
reference to another work is like a citation, whether it is homage or a spoof.

I had the idea to use graph algorithms to analyse the IMDB movie data for quite
a while but only got around to doing it quite recently. Then, after a few days of coding
and just before publishing this blog article I saw that somebody else had
done more or less the same work, a few months earlier: In the blog post
"[The most important movies of all time][]", Thore Husfeldt presents a list of
important movies determined by his [FilmRank][] algorithm, which is pretty much
the same as PageRank.

His list of top films is very similar to mine, which meant at least that the
method I used is presumably correct. As always, it is very hard to come up with novel
ideas (or even application of ideas) in the age of the internet - there is a
very high chance that somebody else has already implemented "your" idea.

Anyway, I won't repeat any lists here (just see Thore's post for that, it's a good
read), but will instead focus on visualisation & code.

## Pretty graphs

Interestingly, a look at the [top 100][] list reveals a lot of well-known films but also some
more obscure ones. How did they get onto this list? It's not really obvious from the
list data, you need to look at the connections to find out why.

<a href="http://www.imdb.com/title/tt0034583/movieconnections">
  <img src="/images/casablanca_graph.png" alt="Casablanca" class="right-img"/>
</a>

One of the properties of PageRank is that important nodes distribute their
importance to all nodes they link to. Now, if a very significant node (let's
say [Casablanca][]) only links to a few other nodes, these nodes will be
considered important as well. So in order to understand these rankings better we need
to look at the links between nodes.

I used [graphviz][] to show connections between top ranked films. Graphviz can
output SVG, so it was pretty easy to create high quality vector documents which
render in most modern browsers (all except Internet Explorer &lt; 9).

Nodes belonging to the same decade are grouped vertically, starting from 1900s
on the left. Films with bold titles indicate a [IMDB Top 250][] title. Darker
coloured nodes are TV series.

As a side note, the algorithm used to produce these rankings does not make a
distinction between movies or TV series - all links are considered to be of
equal importantance. This has the interesting side effect of bringing TV series
into the ranking - almost all top charts (IMDB Top 250 included) do not
contain TV productions, although some of them have a big cultural influence.

## Show me the code

I have released the [source code][github] to produce this rankings, which
makes it reasonably easy it to create your own experiments / rankings. It's
basically just a Rakefile with some Python code to do the analysis part (using
the excellent [NetworkX][] library). Other requirements are Python (&gt;= 2.6)
with [IMDbPy][], Ruby and [graphviz][].

    $ rake rank               # produce the ranking
    $ rake graph.svg MAX=50   # create a graph with max. 50 nodes

## ...and the data

Here are various lists of films as ranked by PageRank:

[The most important movies of all time]: http://thorehusfeldt.net/2010/08/17/the-most-important-movies-of-all-time/
[FilmRank]: http://thorehusfeldt.wordpress.com/2010/08/17/filmrank-methodoly/
[github]: http://github.com/jberkel/imdb-movie-links
[NetworkX]: http://networkx.lanl.gov/
[graphviz]: http://graphviz.org/
[IMDbPY]: http://imdbpy.sourceforge.net/
[Casablanca]: http://www.imdb.com/title/tt0034583/
[IMDB Top 250]: http://www.imdb.com/chart/top
[top 100]:
