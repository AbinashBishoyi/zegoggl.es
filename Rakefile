require 'time'

POST_REGEXP = /^(.+\/)*(\d+-\d+-\d+(?:_\d+-\d+)?)-(.*)(\.[^.]+)$/

module Slugalizer
  extend self
  SEPARATORS = %w[- _ +]
  
  def slugalize(text, separator = "-")
    unless SEPARATORS.include?(separator)
      raise "Word separator must be one of #{SEPARATORS}"
    end
    re_separator = Regexp.escape(separator)
    result = text.dup.to_s
    
    result.gsub!(/[^\x00-\x7F]+/, '')                      # Remove non-ASCII (e.g. diacritics).
    result.gsub!(/[^a-z0-9\-_\+]+/i, separator)            # Turn non-slug chars into the separator.
    result.gsub!(/#{re_separator}{2,}/, separator)         # No more than one of the separator in a row.
    result.gsub!(/^#{re_separator}|#{re_separator}$/, '')  # Remove leading/trailing separator.
    result.downcase!
    result
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
  system "git diff --quiet HEAD"
  raise "uncommited changes detected, commit first!" unless $?.success?

  sh "git push"
  sh "git push github"
end

desc "spellcheck last post"
task :check do
  sh "aspell", "--mode", "html", "--dont-backup", "check", last_post
end

desc "renames last blog post"
task :rename do
  post = IO.read(last_post)
  if post =~ /^(---\s*\n.*?\n?)(---.*?\n)/m    
    content = post[($1.size + $2.size)..-1]
    data = YAML.load($1) || {}
    
    if data['title']
      puts "old '#{data['title']}'"
      new_title = "A new title"
      
      data['title'] = new_title
      new_slug = Slugalizer.slugalize(new_title)
      
      m, cats, date, slug, ext = *last_post.match(POST_REGEXP)              
      new_file = File.join('_posts', "#{date}-#{new_slug}#{ext}")      
      
      puts "writing to #{new_file}"
      
      File.open(new_file, "w") do |f|
        f << YAML.dump(data)
        f << "---\n"
        f << content
      end      
    else
      puts "no title found"
    end
  end
end


def extract_date(fname)
  m, cats, date, slug, ext = *fname.match(POST_REGEXP)
  date = date.sub(/_(\d+)-(\d+)\Z/, ' \1:\2')  # Make optional time part parsable.
  Time.parse(date)
end

def last_post
  FileList['_posts/*'].sort { |a,b| extract_date(b) <=> extract_date(a) }.first
end
