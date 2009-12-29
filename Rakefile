require 'time'

POST_REGEXP = /^(.+\/)*(\d+-\d+-\d+(?:_\d+-\d+)?)-(.*)(\.[^.]+)$/

module Slugalizer
  extend self
  SEPARATORS = %w[- _ +]  
  def slugalize(text, separator = "-")
    raise "Word separator must be one of #{SEPARATORS}" unless SEPARATORS.include?(separator)
    re_separator = Regexp.escape(separator)
    text.to_s.gsub(/[^\x00-\x7F]+/, '').                   # Remove non-ASCII (e.g. diacritics).
           gsub(/[^a-z0-9\-_\+]+/i, separator).            # Turn non-slug chars into the separator.
           gsub(/#{re_separator}{2,}/, separator).         # No more than one of the separator in a row.
           gsub(/^#{re_separator}|#{re_separator}$/, '').  # Remove leading/trailing separator.
           downcase
  end
end

task :default => :server

desc "build the site"
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
  ensure_committed
  sh "git push"
  sh "git push github"
end

desc "spellcheck last post"
task :check do
  sh "aspell", "--mode", "html", "--dont-backup", "check", last_post
end

desc "renames last blog post"
task :rename do
  ensure_committed
  
  old_post = ENV['POST'] || last_post  
  post = IO.read(old_post)
  if post =~ /^(---\s*\n.*?\n?)(---.*?\n)/m    
    content = post[($1.size + $2.size)..-1]
    data = YAML.load($1) || {}
    
    if data['title']      
      new_title = ENV['TITLE'] || begin
        puts "old title: '#{data['title']}'\nEnter new title:"
        STDIN.gets.strip
      end
      
      data['title'] = new_title
      new_slug = Slugalizer.slugalize(new_title)
      
      m, cats, date, slug, ext = *old_post.match(POST_REGEXP)              
      new_file = File.join('_posts', "#{date}-#{new_slug}#{ext}")      

      sh "git mv #{old_post} #{new_file}"      
      File.open(new_file, "w") do |f|
        f << YAML.dump(data)
        f << "---\n"
        f << content
      end      
      puts "#{old_post} => #{new_file}"                        
    else
      puts "no old title found"
    end
  end
end


def ensure_committed
  system "git diff --quiet HEAD"
  raise "uncommited changes detected, please commit your changes first!" unless $?.success?
end

def extract_date(fname)
  m, cats, date, slug, ext = *fname.match(POST_REGEXP)
  date = date.sub(/_(\d+)-(\d+)\Z/, ' \1:\2')  # Make optional time part parsable.
  Time.parse(date)
end

def last_post
  FileList['_posts/*'].sort { |a,b| extract_date(b) <=> extract_date(a) }.first
end
