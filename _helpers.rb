require 'cgi'

FEED_URL = "http://zegoggl.es/feed.atom"
GA_ID    = "UA-7557066-1"

module Helpers

  def url_encode(input)
    CGI.escape(input)
  end

  def array_to_sentence(array)
    connector = "and"
    case array.length
    when 0
      ""
    when 1
      array[0].to_s
    when 2
      "#{array[0]} #{connector} #{array[1]}"
    else
      "#{array[0...-1].join(', ')} #{connector} #{array[-1]}"
    end
  end
  
  def header(text)
    "<h1>%s</h1>" % link_to(text, '/')
  end
  
  def post_link(post)
    link_to(h(post.title), post.url)
  end
end
