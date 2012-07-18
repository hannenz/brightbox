# brightbox.js
 
A simple jQuery lightbox plugin for prototyping. No images needed, all done in CSS(3) - will be ugly in ancient browsers.... won't test
  
2012  Johannes Braun <j.braun@agentur-halma.de>
 
### Markup
~~~
<a class="brightbox" href="an-image.jpg" title="Description of an image"><img src="thumbnail-or-image.jpg" alt="" /></a>
<a class="brightbox" href="another-image.jpg" title="Description of another image"><img src="thumbnail-or-image.jpg" alt="" /></a>
...
~~~

### Javascript
 
~~~
var options = { ... };
$('.brightbox').brightbox(options);
~~~
 
### Options

overlayBgColor string
	:	CSS color description to use for the overlay

boxPadding number
	:	Padding of the brightbox box in px (The "white border around the image);

animate boolean
	:	whether to animate or not

animationSpeed number
	: 	animation speed

onImageClick function
	:	callback function to execute when the image is clicked


### CSS:

See brightbox.css and adjust to fit your needs
