
task :default => :deploy

desc "deploy"
task :deploy => [ :clean, :build ] do
  sh "rsync -var  --checksum  _site/ zegoggles.com:/var/www/zegoggles.com"
end

task :build do
  sh "jekyll"
end

task :clean do
  rm_rf '_site'
end

task :server do
  sh "jekyll --auto --server"
end
