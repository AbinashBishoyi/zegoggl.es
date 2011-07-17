---
  title: "How to preinstall Scala on your Android phone"
  published: true
---

One of the main problems when developing Scala on Android is the fairly heavy
runtime - Scala adds a few megabytes which need to be converted to Dalvik
bytecode during the build process (slow!). The common workaround is to use tools like
[proguard][] or [treeshaker][] to shrink the code before dexing it.

However if this is still to slow there is another option which unfortunately
only works on rooted devices and the Android emulator: predex the Scala
libraries and add them to the Android runtime, on the device itself.

Android has the concept of a boot classpath (similar to the JVM) which contains
all the system framework classes. It is set up in the file /init.rc on the
phone:

    $ adb -d shell 'grep BOOTCLASSPATH init.rc'
    export BOOTCLASSPATH /system/framework/core.jar:
     /system/framework/bouncycastle.jar:
     /system/framework/ext.jar:
     /system/framework/framework.jar:
     /system/framework/android.policy.jar:
     /system/framework/services.jar:
     /system/framework/core-junit.jar

So "all" we need to do is to predexed the Scala library and append it to this path.

## Preparing the emulator

### Predexing the Scala libraries

St&eacute;phane Micheloud has done some work to make this step easy - he created
a bunch of scripts to dex the libraries and create custom RAM images for the Android emulator, described in
[Tweaking the Android emulator][]:

    $ git clone git://github.com/jberkel/android-sdk-scala.git
    $ cd android-sdk-scala
    $ ./bin/createdexlibs
    Using Scala 2.8.1.final in /usr/local/Cellar/scala/2.8.1/libexec
    Generating scala-library.jar...
    Generating scala-collection.jar...
    Generating scala-immutable.jar...
    Generating scala-mutable.jar...
    Generating scala-actors.jar...
    Converting scala-library.jar into a dex file...
    Converting scala-collection.jar into a dex file...
    Converting scala-immutable.jar into a dex file...
    Converting scala-mutable.jar into a dex file...
    Converting scala-actors.jar into a dex file...
    Dex files were successfully generated (configs/framework)

After a successful run the processed libraries can be found in
configs/framework.

### Creating the emulator ramdisks

To create the ramdisks for an emulator you need to run another script:

    $ bin/createramdisks

Boot up the emulator with the modified ram disk and copy the predexed libraries:

    $ emulator -avd ... -ramdisk /path/to/custom.img
    $ adb shell mkdir -p /data/framework
    $ for i in configs/framework/*.jar; do adb push $i /data/framework/; done

Reboot again and make sure the new BOOTCLASSPATH is active:

    $ adb shell echo '$BOOTCLASSPATH'

You should now be able to install and run Scala apks directly on the device
without shipping the whole runtime with each install.

## Patching a real device

If you want to do the same thing on a real device things get a little bit trickier -
you cannot just edit /init.rc and reboot the phone since the init scripts are
included in a filesystem in the boot image, so you need to extract your current
boot image to patch it, reassemble a new image and flash it.

General instructions are available in [HOWTO: Unpack, Edit, and Re-Pack Boot Images][].

### Extract your current boot image

    $ adb shell 'cat /proc/mtd'
    dev:    size   erasesize  name
    mtd0: 000e0000 00020000 "misc"
    mtd1: 00500000 00020000 "recovery"
    mtd2: 00280000 00020000 "boot"
    mtd3: 09100000 00020000 "system"
    mtd4: 05f00000 00020000 "cache"
    mtd5: 0c440000 00020000 "userdata"

    $ adb pull /dev/mtd/mtd2 boot.img

The boot.img file uses a custom layout which contains a header, kernel and the
ramdisk. These parts can be extracted using a Perl script ([split_bootimg.pl][]):

    $ curl https://raw.github.com/gist/1087743/5be96af0e1c1346678379b0c0f0330b71df51f25/split_bootimg.pl
     > split_bootimg.pl
    $ perl split_bootimg.pl boot.img
    Page size: 2048 (0x00000800)
    Kernel size: 1835568 (0x001c0230)
    Ramdisk size: 143802 (0x000231ba)
    Second size: 0 (0x00000000)
    Board name:
    Command line: no_console_suspend=1 wire.search_count=5
    Writing boot.img-kernel ... complete.
    Writing boot.img-ramdisk.gz ... complete.

Now the ramdisk needs to be unpacked:

    $ mkdir ramdisk
    $ cd ramdisk
    $ gzip -dc ../boot.img-ramdisk.gz | cpio -i

You can now make changes to ramdisk/init.rc and add the Scala libraries to
BOOTCLASSPATH, it should look similar to this (without line breaks):

    export BOOTCLASSPATH /system/framework/core.jar:
      /system/framework/bouncycastle.jar:
      /system/framework/ext.jar:
      /system/framework/framework.jar:
      /system/framework/android.policy.jar:
      /system/framework/services.jar:
      /system/framework/core-junit.jar:
      /data/framework/scala-actors.jar:
      /data/framework/scala-collection.jar:
      /data/framework/scala-immutable.jar:
      /data/framework/scala-library.jar:
      /data/framework/scala-mutable.jar

After you have made that change you need to reassemble the boot image. You will
need two command line tools from the Android source code to do that (which need to be
compiled first, here a quick HOWTO: [compile mkbootimg/mkbootfs][]).

    $ mkbootfs ramdisk/ | gzip > newramdisk.gz
    $ mkbootimg  --cmdline 'no_console_suspend=1 wire.search_count=5' \
        --kernel boot.img-kernel \
        --ramdisk newramdisk.gz \
        --base 0x20000000 # Only needed for Nexus One \
        -o boot-new.img

Make sure to adjust the cmdline parameter to reflect the output of the
split\_bootimg command, and to leave out the base parameter if the device is not
a Nexus One.

### Install the new boot image

    $ adb push boot-new.img /sdcard
    $ adb shell

    $ cat /dev/zero > /dev/mtd/mtd2
    write: No space left on device [this is ok, you can ignore]

    $ flash_image boot /sdcard/boot-new.img
    flashing boot from /sdcard/boot-new.img
    mtd: successfully wrote block at 0
    mtd: successfully wrote block at 20000
    mtd: successfully wrote block at 40000
    mtd: successfully wrote block at 60000
    mtd: successfully wrote block at 80000
    mtd: successfully wrote block at a0000
    mtd: successfully wrote block at c0000


Don't forget to copy the Scala jars to /data/framework (same step as emulator
install above), then reboot the phone. It also a good idea to have a recovery update
image on the sdcard in case anything goes wrong.

If everything worked you should see the new BOOTCLASSPATH active after reboot,
test with:

    $ adb shell 'echo $BOOTCLASSPATH'

## Deploy Scala straight to your phone

Now you can enjoy reasonably fast development cycles on your device, when
using the [sbt-android-plugin][] just add the line

    override def skipProguard = true

to your project config ([example][project.scala]). This currently only works
with the development version (0.5.2-SNAPSHOT).

For comparison, a "hello world" Scala project, with proguard enabled:

    $ time sbt clean package-debug
    real    0m40.514s
    user    0m50.632s
    sys 0m2.345s

and without:

    $ time sbt clean package-debug
    real    0m16.507s
    user    0m22.199s
    sys 0m1.873s


When you get to the point of releasing your code you can just re-enable
proguard to produce a distributable package.

[treeshaker]: http://code.google.com/p/treeshaker/
[proguard]: http://proguard.sourceforge.net/
[split_bootimg.pl]: https://gist.github.com/1087743
[Tweaking the Android emulator]: http://lamp.epfl.ch/~michelou/android/emulator-android-sdk.html
[HOWTO: Unpack, Edit, and Re-Pack Boot Images]: http://android-dls.com/wiki/index.php?title=HOWTO:_Unpack%2C_Edit%2C_and_Re-Pack_Boot_Images
[compile mkbootimg/mkbootfs]: https://gist.github.com/1087757
[sbt-android-plugin]: https://github.com/jberkel/android-plugin
[project.scala]: https://gist.github.com/1087819
