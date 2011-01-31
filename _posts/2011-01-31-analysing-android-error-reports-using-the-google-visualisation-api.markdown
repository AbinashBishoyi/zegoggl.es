---
  title: "Analysing Android error reports using the Google visualisation API"
  published: true
---


<a href="http://jberkel.github.com/sms-backup-plus/acra-analysis">
<img
src="https://github.com/downloads/jberkel/sms-backup-plus/acra-analysis-screenshot.png"
width="300" class="right-img"/>
</a>

[ACRA][] is a great little Android open source library which posts error
reports (stack traces) from your application in the wild to a Google
spreadsheet. It is an important tool especially given the limitation of Google's
built-in error reporting (Android market aps / 2.2+ only).

So with ACRA in place you can easily check all error reports, inspect stack traces and so
on.

What's missing however is the big picture - are there more crashes on Android 1.x
than on 2.x ? Has the latest upgrade of your app improved the situation? Has the
Motorola DROID really the buggiest Android firmware on this planet?

Because ACRA uses a Google spreadsheets to store the data it is very easy to run
queries against it with the [Google Visualization API][]. The API has two
layers - a data access layer with a powerful [query language][] (similar to
SQL) and a lot of different components to visualise the data.

The interesting parts of the query language for this project are the `GROUP BY`
and `PIVOT` clauses. Getting crash counts for different application versions,
grouped by different device models is very easy:

<pre>
  <code>
    SELECT model, COUNT(A) GROUP BY model PIVOT version
  </code>
</pre>

The results can now directly be used to create a new dynamic table or chart
(check out the [live demo][]).

To use this for your own application take a look at [acra-analysis.html][] and
change the Spreadsheet link.  You will also need to set the sharing settings of
the spreadsheet to 'Anyone with the link' or 'public'. If this project evolves
further I'll probably move it to a separate project.

## Rant

These analytic features should really be part of the Google Android dev console -
they own all the pieces to build it but then leave it to somebody else.
The fact that an open source project (ACRA) is superior to the
built-in crash monitoring (which arrived really late) says it all.


[ACRA]: http://code.google.com/p/acra/
[acra-analysis.html]: https://github.com/jberkel/sms-backup-plus/blob/gh-pages/acra-analysis.html
[Google Visualization API]: http://code.google.com/apis/visualization/documentation/
[Screenshot]: https://github.com/downloads/jberkel/sms-backup-plus/acra-analysis-screenshot.png
[live demo]: http://jberkel.github.com/sms-backup-plus/acra-analysis
[License]: https://github.com/jberkel/sms-backup-plus#license
[query language]: http://code.google.com/apis/visualization/documentation/querylanguage.html
[SMS Backup+]: http://github.com/jberkel/sms-backup-plus
