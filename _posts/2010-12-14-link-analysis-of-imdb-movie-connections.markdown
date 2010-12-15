---
title: Link analysis of IMDB movie connections
published: true
---

## “Louis, I think this is the beginning of a beautiful friendship”

<a href="http://www.imdb.com/title/tt0034583/movieconnections">
  <img src="/images/imdb_casablanca_connections.png" alt="Casablanca" class="right-img"/>
</a>

The movie database IMDB is a great source of information, but there is one
aspect of it most people don't know about: most films have a "Movie connections"
section, which lists all references to other films (or TV series). What can be
considered a reference is pretty open: it could be music, a film poster
visible in a scene, or one of the characters uttering a well-known line from
another film, like Humphrey Bogart's words "I think this is the beginning of a
beautiful friendship" from Casablanca's famous ending.

The current [IMDB dataset][] contains around one million of those references, far
too many to visualise or comprehend easily. So how could this data be filtered,
to get to the interesting films and references?

## Rank it!

Now, if you look at film references as edges between nodes (films) in a graph you
can apply existing algorithms like [PageRank][] to obtain a score for each film,
similar to one of the ways Google determines importance of web pages. An intentional
reference to another film is similar to citation in a book, or a link to another
web page.

I have had the idea to use graph algorithms to analyse the IMDB movie
connections for a while now but only started building something until quite
recently. Then, after a few days of coding and just before publishing this
blog article I saw that somebody else had done more or less the same work, a
few months earlier: in the blog post "[The most important movies of all
time][]", Thore Husfeldt presents a list of important movies as determined by
his [FilmRank][] algorithm which is (as the name suggest) pretty similar to
PageRank.

The tl;dnr version of the blog post: PageRank on a movie reference graph
produces lists very similar to top film lists compiled by critics. The list he
presents is also similar to mine, so I will not repeat it here (available as [CSV file][Top
250 (CSV)]).

As always, it is very hard to come up with novel ideas (or even just
applications thereof) - there is a very high probability that somebody has
already implemented and published "your" idea somewhere on the internet.
However there are two things  his article is lacking: a graphical
representation of the results and the source code to obtain them from the raw
IMDB data set.

## Pretty graphs and weird numbers

Interestingly, a look at the [Top 250 (CSV)][] list reveals a lot of
well-known films but also some more obscure ones. How did they get on this
list? It's not really obvious from the list data itself, you need to look at the
connections to find out why.

<a href="/svg/imdb_top_250.svg">
  <img src="/images/21-87.png" alt="21-87 Graph" class="right-img"/>
</a>

One of the properties of PageRank is that important nodes distribute their
importance to all nodes they link to. Now, if a very significant node (let's
say [Star Wars][]) links to a few other nodes, these nodes will be considered
important as well. So in order to understand these rankings better we need to
look at the links between nodes.

I created a few graphs with the top N films and all the connections in
between them, filtering out unconnected nodes. In the graph on the side, I was
curious about the film on the left, [21-87][]. I had never heard of it, but it
is obviously ranked highly because Star Wars and [THX 1138][] refer to it.
Both these films were directed by George Lucas (THX 1138 was his first film),
so there had to be be some sort of connection.

<a href="http://www.imdb.com/title/tt0222664/movieconnections">
  <img src="/images/21-87_connections.png" alt="21-87 connections" class="left-img"/>
</a>

A quick look at the movie connections page revealed two numerical references
(Leia's Death Star cell number and a date), and a search for "21-87 George
Lucas" finds the article "[21-87: How Arthur Lipsett influenced George
Lucas’s career][]" which goes on to explain how Lipsett's experimental short
films influenced the sound design of George Lucas' later films.

I used [graphviz][] to show connections between top ranked films. Graphviz can
output SVG, so it was pretty easy to create high quality vector documents which
render in most modern browsers (all except Internet Explorer &lt; 9).

There are a few different versions since more nodes means more edges and
therefore less readability (I did not apply any sort of edge pruning):

  * [Top 50 (SVG)][]
  * [Top 100 (SVG)][]
  * [Top 250 (SVG)][]

And the raw data:

  * [Top 250 (CSV)][]

Films from the same decade are grouped vertically, starting from the 1900s
on the left. Tooltips show more information about each film, and each node
links directly to the IMDB connections page. Films with bold titles indicate a [IMDB
Top 250][] title. Darker coloured nodes are TV series. Since the SVG standard
does not yet have zoom controls you will need to use your browser's zoom
controls.

As a side note, the algorithm used to produce these rankings does not make a
distinction between movies or TV series - all links are considered to be of
equal importance. This has the interesting side effect that TV series
make it into the ranking - almost all top charts (IMDB Top 250 included) do not
contain TV productions, although some of them had a big influence on cinema.
You might wonder then why the Simpsons (a true reference generating machine)
are not part of the graph - although they rank 61st the IMDB data only contains incoming
links for them, presumably because they already have their own reference
database, the [episode guidebook][SNPP].

Also there is no link dampening applied (downweighting references from a recent film to an old
film).

## Show me the code

I have released the [source code][github] to produce this rankings, which
makes it reasonably easy it to create your own experiments and graphs. It is
basically just a glue Rakefile with some Python code to do the analysis part
(using the excellent [NetworkX][] library). Other requirements are Python
(&gt;= 2.6) with [IMDbPy][], Ruby (&gt;= 1.9) and [graphviz][].

     $ git clone git://github.com/jberkel/imdb-movie-links.git
     $ cd imdb-movie-links
     $ easy_install networkx imdbpy
     $ brew install graphwiz wget   # OSX
     $ bundle install
     $ rake rank                    # CSV export ranking
     $ rake graph.svg MAX=50        # create a graph, max. 50 nodes

Happy ranking!

[IMDB dataset]: http://www.imdb.com/interfaces#plain
[The most important movies of all time]: http://thorehusfeldt.net/2010/08/17/the-most-important-movies-of-all-time/
[FilmRank]: http://thorehusfeldt.wordpress.com/2010/08/17/filmrank-methodoly/
[PageRank]: http://en.wikipedia.org/wiki/PageRank
[github]: http://github.com/jberkel/imdb-movie-links
[NetworkX]: http://networkx.lanl.gov/
[graphviz]: http://graphviz.org/
[IMDbPY]: http://imdbpy.sourceforge.net/
[Casablanca]: http://www.imdb.com/title/tt0034583/
[Star Wars]: http://www.imdb.com/title/tt0076759/
[THX 1138]: http://www.imdb.com/title/tt0066434/
[21-87]: http://www.imdb.com/title/tt0222664/
[21-87: How Arthur Lipsett influenced George Lucas’s career]: http://www.dangerousminds.net/comments/21-87_how_arthur_lipsett_influenced_george_lucass_thx-1138/
[IMDB Top 250]: http://www.imdb.com/chart/top
[Top 50 (SVG)]: /svg/imdb_top_50.svg
[Top 100 (SVG)]: /svg/imdb_top_100.svg
[Top 250 (SVG)]: /svg/imdb_top_250.svg
[Top 250 (CSV)]: /data/imdb_top_250.csv
[SNPP]: http://www.snpp.com/episodeguide.html
