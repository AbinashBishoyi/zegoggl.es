---
  title: "Building Android apps in Scala with sbt"
  published: true
---

If you're thinking about developing Android apps in Scala there are not that many different options for building your project - I started out with a hack
based on Rake [(source)](http://github.com/jberkel/android-helloworld-scala/blob/master/Rakefile), then there are some ways to get Eclipse to build your project, as documented on the [Novoda blog](http://www.novoda.com/blog/?p=154). I personally don't use an IDE, Scala is in contrast to Java perfectly usable in a normal text editor, mainly because it requires a lot less typing and boiler plate code. 

My solution based on Rake worked well but had a couple of shortcomings - it added another language to the codebase, and not everyone is necessarily familiar with Ruby, additionally your build time gets longer as the Scala compiler will always perform a full rebuild of the project. A Scala source file typically produces more than just one single class file, so it's not possible to perform a simple time stamp-based check and just recompile changed files. Unfortunately the compiler itself is not able to figure out which files need rebuilding (however, this will change in the upcoming Scala 2.8). The Scala based build system [sbt](http://code.google.com/p/simple-build-tool/) implements partial recompilation which means that the code will get built a lot faster. Besides speed improvements it also gives you a complete build tool with external dependency management using [Apache Ivy](http://ant.apache.org/ivy/) (Maven dependencies are supported as well).

Sbt also follows Rake's approach of using the language itself for the configuration of the build which gives you additional flexibility and expressiveness over static XML files. It also makes the reuse of build steps a lot simpler because you can use the host language's natural abstraction mechanisms. So when I decided to reimplement my build system with sbt it turned out that someone had already written an Android plugin for it. Mark Harrah, the author of sbt, extracted it from someone elses Android project and released it on github, where I found it. I had to make a couple of modifications to get it to build my project but it quickly became obvious that sbt was a better fit for Android Scala projects than any other ad-hoc solution. Mark merged my changes back into his repository and eventually asked me whether I wanted to take over maintenance of the plugin, hence this introductory blog post. Let's get started!

###Installing sbt

First you need to install sbt itself (assuming that Scala is already installed). Detailed instructions are available [here](http://code.google.com/p/simple-build-tool/wiki/Setup), but in a nutshell:

<pre>
  <code class="bash">
  $ cd ~/bin # or any other directory in your path
  $ wget http://simple-build-tool.googlecode.com/files/sbt-launcher-0.5.6.jar
  $ echo 'java -Xmx512M -jar `dirname $0`/sbt-launcher-0.5.6.jar "$@"' > sbt
  $ chmod u+x sbt
  </code>
</pre> 

###Generating a new project

To get started with new projects sbt already ships with a generator which will set up the initial directory structure (run sbt without arguments). Unfortunately, when using plugins the situation is a bit more complicated as the plugin itself needs to be set up. To make things simpler I created a Scala script to bootstrap a full Android project with sbt. You simply call it with the name of your project and package:

<pre>
  <code class="bash">
  $ git clone git://github.com/jberkel/android-plugin.git
  $ cd android-plugin
  $ contrib/create_project foo com.example.android
  </code>
</pre>  

This will create a fully usable Android project called Foo with one activity (showing Hello World).
  

The generated directory layout follows Maven conventions:

<pre>
  <code class="bash">
    |-- project
    |   |-- build
    |   |   `-- Foo.scala
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
    |   |       `-- Activity.scala
    |   `-- test
    |       `-- scala
    |           `-- Specs.scala
    `-- tests
  </code>
</pre>

The sbt build configuration is in the *project* directory, source code and unit tests in *src*, *tests* is used for Android integration testing (more on that later).

###Build configuration

The main project build information is contained in the file *project/build/Foo.scala*: 

<pre>
  <code class="scala">
    import sbt._

    trait Defaults {
      def androidPlatformName = "android-1.6"
    }
    class Foo(info: ProjectInfo) extends ParentProject(info) {
      override def shouldCheckOutputDirectories = false
      override def updateAction = task { None }
      
      lazy val main  = project(".", "foo", new MainProject(_))
      lazy val tests = project("tests",  "tests", new TestProject(_), main)

      class MainProject(info: ProjectInfo) extends AndroidProject(info) with Defaults {    
        val scalatest = "org.scalatest" % "scalatest" % "1.0" % "test"
      }

      class TestProject(info: ProjectInfo) extends AndroidTestProject(info) with Defaults
    }
  </code>     
</pre>

The project definition is contained in the class Foo which extends ParentProject, a special sbt construct for supporting multiple projects in one single file ([sub project documentation](http://code.google.com/p/simple-build-tool/wiki/SubProjects)). This is necessary because Android integration tests have to be built and installed as a separate apk package. Note the use of Scala's traits to mix in default settings for both projects. If you don't need integration tests in your application you can use a simpler project definition which could look like this:

<pre>
  <code class="scala">
  import sbt.__
  class Foo(info: ProjectInfo) extends AndroidProject(info) {
    override def androidPlatformName = "android-1.6"    
  }
  </code>
</pre>  

###Dependency management

The main advantage of using sbt/Ivy as a dependency manager is that you declare your dependencies programmatically instead of shipping all the jar files with your project, sbt will then figure out on build time which libraries to download. In sbt, an external dependency is declared as follows:

<pre>
  <code class="scala">
   val scalatest = "org.scalatest" % "scalatest" % "1.0" % "test->default"
  </code>
</pre>   

This declares a dependency to the module "scalatest" (a Scala test framework), using version 1.0 in the test configuration. A configuration in Ivy works similar to scopes in Maven, you usually use them to separate build and runtime dependencies (sbt will automatically exclude build dependencies from the package).

###Hello Android

Besides creating the necessary directory structure for building Scala projects the generator script will also create a simple "Hello World"-style activity, which can be found in *src/main/scala/Activity.scala*.

<pre>
  <code class="scala">
  class MainActivity extends Activity {
    override def onCreate(savedInstanceState: Bundle) {
      super.onCreate(savedInstanceState)
      setContentView(new TextView(this) {
        setText("hello, world")
      })
    }
  }
  </code>
</pre>  

In order to build the full package, use the package-debug sbt action:

<pre>
  <code class="bash">
  $ export ANDROID_SDK_HOME=path/to/android_sdk
  $ sbt update             # download dependencies
  $ sbt package-debug      # build packages
  $ sbt reinstall-emulator # (re)install in emulator
  </code>
</pre>

This will download all dependencies, then compile and build the two packages (*target/foo-0.1.apk*, *tests/target/tests-0.1.apk*). It is worth noting that sbt has two different modes of operation: interactive and command-line. If invoked without action arguments, the interactive session will be launched, which saves start-up time and is quite useful in general.

Sbt will automatically recompile the project definition (even when in interactive mode) which makes it (almost) as easy to use as other script-based solutions.

###1,2,3 testing

Sbt has built-in support for most common Scala testing frameworks (ScalaCheck, specs, ScalaTest). It automatically detects the framework you are using in your project, usually "sbt test" will do the Right Thing. The example project set up by the script defaults to [ScalaTest](http://www.scalatest.org/).

Another nifty feature is continuous compilation / testing. When you prefix any command with a tilde (~), sbt will automatically trigger the action as soon as one of the source files changes, which is very useful when doing test-driven development.

Integration testing (= running tests on-device) on Android is quite painful: you have to create a separate project, get the dependencies right, install the package and run a separate command. With sbt's multiproject support it becomes quite easy to handle integration tests, you can subclass AndroidTestProject to get some additional actions for running tests in an emulator (*test-emulator* and *test-device*).






