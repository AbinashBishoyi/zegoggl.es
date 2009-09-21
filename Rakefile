
require 'time'

task :default => :server

task :build do
  sh "jekyll"
end

desc "rebuild, then deploy to remote"
task :deploy => [ :clean, :build ] do
  sh "rsync -var --checksum _site/ zegoggl.es:/var/www/zegoggles.com"
end

desc "clean"
task :clean do
  rm_rf '_site'
  FileList['**/*.bak'].clear_exclude.each do |f|
    rm_f f
  end
end

desc "run server"
task :server do
  sh "jekyll --auto --server"
end

desc "push to git repo(s)"
task :push do
  system "git diff --quiet HEAD"
  raise "uncommited changes detected, commit first!" unless $?.success?

  sh "git push"
  sh "git push github"
end

desc "spellcheck last post"
task :check do
  sh "aspell", "--mode", "html", "check", last_post
end

def extract_date(fname)
  m, cats, date, slug, ext = *fname.match(/^(.+\/)*(\d+-\d+-\d+(?:_\d+-\d+)?)-(.*)(\.[^.]+)$/)
  date = date.sub(/_(\d+)-(\d+)\Z/, ' \1:\2')  # Make optional time part parsable.
  Time.parse(date)
end

def last_post
  FileList['_posts/*'].sort { |a,b| extract_date(b) <=> extract_date(a) }.first
end
