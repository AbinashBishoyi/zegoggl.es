---
  title: "Build Android apps in Scala with sbt"
  published: true
---

If you're thinking about developing Android apps in Scala there are not that many different options for building your project - I started out with a quickly cobbled together Rakefile [(source)](http://github.com/jberkel/android-helloworld-scala/blob/master/Rakefile), then there are some ways to get Eclipse to build your project, as documented on the [Novoda blog](http://www.novoda.com/blog/?p=154). I personally don't use an IDE, Scala is in contrast to Java perfectly usable in a normal text editor, mainly because it requires a lot less typing and boiler plate code. 

My solution based on Rake worked well but had a couple of shortcomings - you introduce another language to your project, and not everyone is necessarily familiar with Ruby, secondly your build time gets longer as the Scala compiler will always perform a full rebuild of the project. I probably need to explain this a little bit more in detail: a Scala source file typically produces more than just one single class file, so it's not possible to perform a simple timestamp-based check and just recompile changed files. Unfortunately the compiler itself is not able to figure out which files need rebuilding (however, this will change in the upcoming Scala 2.8). The Scala based build system [sbt](http://code.google.com/p/simple-build-tool/) implements partial recompilation which means that the code will get built a lot faster. Besides speed improvements it also gives you a complete build tool with external dependency management using [Apache Ivy](http://ant.apache.org/ivy/) (Maven dependencies are supported as well).

Sbt also follows Rake's approach of using the language itself for the configuration of your build which gives you additional flexibility and expressiveness over static XML files. It also makes the reuse of build steps a lot simpler because you can use the host language's natural abstraction mechanism. So when I decided to reimplement my build system with sbt it turned out that someone had already written an Android plugin for it. Mark Harrah, the author of sbt, extracted it from someone else's Android project and put it on github, where I found it. I had to make a couple of modifications to get it to build my project but it quickly became clear that sbt was a far superior solution to Rake. Mark merged my changes back into his repository but eventually asked me whether I wanted to take over maintenance of the plugin, hence this introductory blog post. Let's get started!


###Installing sbt

First you need to install sbt itself (assuming that Scala is already installed). Detailed instructions are available [here](http://code.google.com/p/simple-build-tool/wiki/Setup), but in a nutshell:

<pre>
  <code class="bash">
  $ cd ~/bin        # or any other directory in your path
  $ wget http://simple-build-tool.googlecode.com/files/sbt-launcher-0.5.6.jar
  $ echo 'java -Xmx512M -jar `dirname $0`/sbt-launcher-0.5.6.jar "$@"' > sbt
  $ chmod u+x sbt
  </code>
</pre> 

###Generating the project

To get started with new projects sbt already ships with a generator which will set up the initial directory structure (run sbt without arguments). Unfortunately, when using plugins the situation is a bit more complicated as the plugin itself needs to be set up. To make things simpler I created a Scala script to boostrap a full Android project with sbt.

<pre>
  <code class="bash">
  $ git clone git://github.com/jberkel/android-plugin.git
  $ cd android-plugin
  $ contrib/create_project Test com.example.android
  </code>
</pre>  

This will create a fully usable Android project with one activity which can build and and install a Hello World app.


The generated directory layout follows maven conventions:

<pre>
  <code class="bash">
    |-- project
    |   |-- build
    |   |   `-- Project.scala
    |   |-- build.properties
    |   `-- plugins
    |       `-- Plugins.scala
    |-- src
    |   |-- main
    |   |   |-- AndroidManifest.xml
    |   |   |-- assets
    |   |   |-- java
    |   |   |-- res
    |   |   |   |-- drawable
    |   |   |   |-- layout
    |   |   |   |-- values
    |   |   |   `-- xml
    |   |   `-- scala
    |   |       `-- activity.scala
    |   `-- test
    |       `-- scala
    |           `-- spec.scala
    `-- tests
  </code>
</pre>

The sbt build configuration is in the *project* directory, source code and unit tests in *src*, *tests* is used for Android integration testing (more on that later).

###Build configuration

The main project build information is contained in the file *project/build/project.scala*: 

<pre>
  <code class="scala">
  import sbt._

  class Test(info: ProjectInfo) extends ParentProject(info) {
    override def shouldCheckOutputDirectories = false

    lazy val main = project(".", "main", new MainProject(_))
    lazy val tests = project("tests",  "tests", new TestProject(_), main)

    class Defaults(info: ProjectInfo) extends AndroidProject(info) {
      override def androidSdkPath = Path.fromFile("/projects/android-sdk-mac_x86-1.6_r1")
    }

    class MainProject(info: ProjectInfo) extends Defaults(info) {    
      val scalatest = "org.scalatest" % "scalatest" % "1.0" % "test->default"
    }

    class TestProject(info: ProjectInfo) extends Defaults(info) {
      override def proguardInJars = Path.emptyPathFinder
      lazy val runTest = defaultAdbTask(true, "shell am instrument -w "+manifestPackage+
      "/android.test.InstrumentationTestRunner") describedAs("runs instrumentation tests")        
    } 
  }
  </code>     
</pre>

The class Test extends ParentProject, which is a special sbt construct for supporting multiple projects in one single file ([subproject documentation](http://code.google.com/p/simple-build-tool/wiki/SubProjects)). This is necessary because Android integration tests have to be build and installed as a separate apk package. 

###Dependency management

The main advantage of using Ivy as a dependency manager is that you declare your dependencies programatically (as opposed to bundling all the jar files with your project), sbt will then figure out on build time which libraries to download. In sbt, a dependency is declared as follows:

<pre>
  <code class="scala">
   val scalatest = "org.scalatest" % "scalatest" % "1.0" % "test->default"
  </code>
</pre>   

This declares a dependency to the module "scalatest" (a Scala test framework), using version 1.0 in the test configuration. A configuration in Ivy works similar to scopes in Maven, so you can distinguish between build and runtime dependencies. 

###Hello Android

Besides creating the necessary directory structure for building Scala projects the generator script has also created a simple "Hello World"-style activity, which can be found in *src/main/scala/activity.scala*.

In order to build the full package, use the package-debug sbt action:

<pre>
  <code class="bash">
  $ sbt package-debug      # build packages
  $ sbt reinstall-emulator # install in emulator
  </code>
</pre>

This will download all dependencies (only on first build), then compile and build the packages (*target/main-0.1.apk*, *tests/target/tests-0.1.apk*). It is worth noting that sbt has two different modes of operation: interactive and command-line. If invoked without action arguments, the interactive session will be launched, which saves start-up time and is quite useful in general.

It's probably easiest to demonstrate the whole process in a screencast.











