---
  title: "Build Android apps in Scala with sbt"
  published: false
---

If you're thinking about developing Android apps in Scala there are not that many different options for building your project - I started out with a was quickly cobbled together Rakefile [(source)](http://github.com/jberkel/android-helloworld-scala/blob/master/Rakefile), then there are some ways to get Eclipse to build your project, as documented on the [Novoda blog](http://www.novoda.com/blog/?p=154). I personally don't use Eclipse, and Scala itself is in contrast to Java usable in a normal text editor, mainly because it requires a lot less typing and boiler plate code. 

My solution based on rake worked well but had a couple of shortcomings - firstly you introduce another language to your project, and not everyone is necessarily familiar with Ruby, secondly your build time gets longer as the Scala compiler will always perform a full rebuild of the project. I probably need to explain this a little bit more in detail: a Scala source file typically produces more than just one single class file, so it's not possible to perform a simple timestamp-based check and just recompile changed files. Unfortunately the compiler itself is not able to figure out which files need rebuilding (however, this will change in the upcoming Scala 2.8). The Scala based build system [sbt](http://code.google.com/p/simple-build-tool/) implements partial recompilation which means that the code will get built a lot faster. Besides speed improvements it also gives you a complete build tool with external dependency management using [Apache Ivy](http://ant.apache.org/ivy/) (Maven dependencies are supported as well).

Sbt also follows rake's approach of using the language itself for the configuration of your build which gives you additional flexibility and expressiveness over static XML files. It also makes the reuse of build steps a lot simpler because you can use the host language's natural abstraction mechanism. So when I decided to reimplement my build system with sbt it turned out that someone had already written an Android plugin for it. Mark Harrah, the author of sbt, extracted it from someone else's Android project ([saisiyat](http://github.com/weihsiu/saisiyat/)) and put it on github, where I found it. I had to make a couple of modifications to get it to build my project but it quickly became clear that sbt was a far superior solution to my previous ad-hoc rakefile. Mark merged my changes back into his repository but eventually asked me whether I wanted to take over maintenance of the plugin, hence this introductory blog post. Let's get started!


###Installing sbt

First you need to install sbt itself (assuming that Scala is already installed). Detailed instructions are available [here](http://code.google.com/p/simple-build-tool/wiki/Setup), but in a nutshell:

<pre>
  <code class="bash">
  $ cd ~/bin        # or any other directory in your path
  $ wget http://simple-build-tool.googlecode.com/files/sbt-launcher-0.5.6.jar
  $ echo 'java -Xmx512M -jar `dirname $0`/sbt-launcher.jar "$@"' > sbt
  $ chmod u+x sbt
  </code>
</pre> 

To get started with new projects sbt already ships with a generator which will set up the initial directory structure plus project files. Unfortunately, when using plugins the situation is a bit more complicated as the plugin itself needs to be set up. To make things simpler I created a Scala script to boostrap a full Android project with sbt.

###Generating the project

<pre>
  <code class="bash">
  $ git clone git://github.com/jberkel/android-plugin.git
  $ android-plugin/contrib/create_android_project --project Test --package com.example.android
  </code>
</pre>  

This will create a fully usable Android project with one activity which can build and and install a Hello World app.
 

###Dependency management

The main advantage of using Ivy as a dependency manager is that you declare your dependencies programatically (as opposed to bundling all the jar files with your project), sbt will then figure out on build time which libraries to download. In sbt, a dependency is declared as follows:

<pre>
  <code class="scala">
   val scalatest = "org.scalatest" % "scalatest" % "1.0" % "test->default"
  </code>
</pre>   

This declared a dependency to the module "scalatest" (a Scala test framework), using version 1.0 in the test configuration.

<pre>
  <code class="scala">
  package com.foo.test

  import _root_.android.app.Activity
  import _root_.android.os.Bundle
  import _root_.android.widget.TextView

  class MainActivity extends Activity with Foo {
    override def onCreate(savedInstanceState: Bundle) {
      super.onCreate(savedInstanceState)
      setContentView(new TextView(this) {
        setText("Hello Android, I'm Scala!")                    
      })
    }
  }
  </code>
</pre>






