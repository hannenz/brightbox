/*
 * =====================================================================
 * jquery.brightbox.js
 * =====================================================================
 * A simple jQuery lightbox plugin for prototyping.
 * 
 * - Keyboard navigation
 * - lightweight and solid
 * - No images needed, all done in CSS(3) - will be ugly in ancient browsers.... won't test
 * 
 * 2012
 * Johannes Braun <j.braun@agentur-halma.de>
 * 
 * Markup:
 * -------
 * <!-- Include Stylesheet, jQuery and Plugin -->
 * <link rel="stylesheet" type="text/css" href="/path/to/jquery.brightbox.min.css" />
 * <script src="/path/to/jquery.min.js"></script>
 * <script src="/path/to/jquery.brightbox.min.js"></script>
 * 
 * <a class="brightbox" href="an-image.jpg" title="Description of an image"><img src="thumbnail-or-image.jpg" alt="" /></a>
 * <a class="brightbox" href="another-image.jpg" title="Description of another image"><img src="thumbnail-or-image.jpg" alt="" /></a>
 * 
 * Javascript:
 * -----------
 * var options = { ... };
 * $('.brightbox').brightbox(options);
 * 
 * Options:
 * closeOnOverlayClick boolean	Whethet or not a click on the overlay closes the box (default: true)
 * animate boolean				whether or not to animate the resize between images (default: true)
 * animaitionSpeed integer		Animation speed (default: 500)
 * onImageClick function		Callback function to execute when the image is clicked. Prototyp of the callback function is 
 * 									callback_function(imageURL);
 * 
 * Stylesheet:
 * -----------
 * See jquery.brightbox.css and adjust to fit your needs
 * 
 */
 ;(function($){
	jQuery.fn.brightbox = function(arg){
		
		var options = $.extend({}, $.fn.brightbox.defaults, arg);

		var box = $('<div class="brightbox"></div>');
		var overlay = $('<div class="brightbox-overlay" />');
		var close = $('<a title="close" class="brightbox-button brightbox-close" href="#">&times;</a>');
		var next = $('<a title="next" class="brightbox-button brightbox-next" href="#">&raquo;</a>');
		var prev = $('<a title="previous" class="brightbox-button brightbox-prev" href="#">&laquo;</a>');
		var info = $('<div class="brightbox-info-box" />');
		var current = 0;
		var imageLinks = this;
		var image;
		var initBoxCss = {
				'top' : parseInt(($(window).height() - 100) / 2),
				'left' : parseInt(($(window).width() - 100) / 2),
				'width' : 100,
				'height' : 100
		};
		
		if (imageLinks.length < 1){
			return null;
		}
		
		box
			.append(close)
			.append(prev)
			.append(next)
			.append(info)
			.css(initBoxCss)
			.appendTo(overlay)
			.bind('mousewheel', onMousewheel)
		;
			
		if (options['closeOnOverlayClick']){
			overlay.bind('click', closeBrightBox);
		}

		overlay.hide();
		box.hide();
		$('body').prepend(overlay).prepend(box);

		return this.each(function(){

			$(this).bind('click', onClick);
			
			function onClick(event){
				event.preventDefault();
				
				var imageURL = $(this).attr('href');

				var title = $(this).attr('title');

				for (var i = 0; i < imageLinks.length; i++){
					if (imageURL == $(imageLinks[i]).attr('href')){
						current = i;
						break;
					}
				}
				showBrightBox(imageURL, title);
				return false;
			}
		});

		/*
		 * CALLBACKS
		 * =====================================
		 */
		
		function closeBrightBox(){
			if (options['animate']){
				overlay.fadeOut(options['animationSpeed'], cleanUp);
				box.fadeOut(options['animationSpeed']);
			}
			else {
				overlay.hide();
				box.hide();
				cleanUp();
			}

			function cleanUp(){
				box.css(initBoxCss).hide();
				$(document).unbind('keyup');
				
			}
		}

		function nextBrightBox(){
			if (++current == imageLinks.length){
				current = 0;
			}
			var imageLink = imageLinks[current];
			var imageURL = $(imageLink).attr('href');
			showBrightBox(imageURL, $(imageLink).attr('title'));
		}
		
		function prevBrightBox(){
			if (current == 0){
				current = imageLinks.length;
			}
			current--;
			var imageLink = imageLinks[current];
			var imageURL = $(imageLink).attr('href');
			showBrightBox(imageURL, $(imageLink).attr('title'));
		}

		function onKeyUp(event){
			event.preventDefault();
			event.stopPropagation();

			switch(event.keyCode){
				case 39:
					nextBrightBox();
					break;
				case 37:
					prevBrightBox();
					break;
				case 27:
					closeBrightBox();
					break;
				default:
					if (options['closeOnOverlayClick']){
						closeBrightBox();
					}
					break;
			}
			return false;
		}
		
		function onMousewheel(event, delta){
			event.preventDefault();
			event.stopPropagation();
			if (imageLinks.length > 1){
				if (delta > 0){
					nextBrightBox();
				}
				else {
					prevBrightBox();
				}
			}
			return false;
		}
		
		/*
		 * FUNCTIONS
		 * ========================================
		 */

		function showBrightBox(imageURL, title){
			overlay.css('opacity', '0.9');
			if (options['animate']){
				overlay.fadeIn(options['animationSpeed']);
				box.fadeIn(options['animationSpeed']);
			}
			else {
				overlay.show();
				box.show();
			}
			
			box.find('img').remove();
			
			$(document).unbind('keyup');
			$(document).bind('keyup', onKeyUp);

			close.bind('click', function(event){
				event.preventDefault();
				event.stopPropagation();
				closeBrightBox();
				return false;
			});
			
			next.bind('click', function(event){
				event.preventDefault();
				event.stopPropagation();
				if (options['animate']){
					box.find('img').fadeOut(options['animationSpeed'], nextBrightBox);
				}
				else {
					box.find('img').show();
					nextBrightBox();
				}
				return false;
			});
			prev.bind('click', function(event){
				event.preventDefault();
				event.stopPropagation();
				if (options['animate']){
					box.find('img').fadeOut(options['animationSpeed'], prevBrightBox);
				}
				else {
					box.find('img').show();
					prevBrightBox();
				}
				return false;
			});
		
			box.addClass('busy');
			info.hide();
			
			if (options['simulateSlowBandwidth']){
				setTimeout(loadImage, options['simulateSlowBandwidth']);
			}
			else {
				loadImage();
			}
			
			function loadImage(){
				image = new Image();
				image.src = imageURL;

				image.onload = function(){
					
					box.removeClass('busy');
					
					var ratio = image.width / image.height;
					if (image.height > $(window).height()){
						image.height = $(window).height() - 50;
						image.width = image.height * ratio;
					}
					if (image.width > $(window).width()){
						image.width = $(window).width();
						image.height = image.width / ratio;
					}
					
					$(image).hide().bind('click', function(event){
						event.preventDefault();
						event.stopPropagation();
						
						if (options['onImageClick']){
							options['onImageClick'](imageURL);
						}
						
						return false;
					});
					
					var newCss = {
						'top' : parseInt(($(window).height() - image.height) / 2),
						'left' : parseInt(($(window).width() - image.width) / 2),
						'width' : parseInt(image.width),
						'height' : parseInt(image.height),
					};
					
					if (options['animate'] == true){
						box.animate(newCss, options['animationSpeed'], afterShow);
					}
					else {
						box.css(newCss);
						afterShow();
					}
				}
				function afterShow(){
					var img = box.find('img');
					img.remove();
					
					box.append(image);
					
					if (imageLinks.length == 1){
						box.find('.brightbox-prev, .brightbox-next').hide();
					}
					
					if (title){
						info.html(title);
						title.length > 0 ? info.show() : info.hide();
					}
					
					box.css({'overflow' : 'visible'}); // Need this for webkit... dunno why though... ^^
					options['animate'] ? $(image).fadeIn() : $(image).show();
				}
				
			}
		}
	};

	/*
	 *  Default options
	 *================================
	 */
	$.fn.brightbox.defaults = {
		closeOnOverlayClick : true,
		animate : true,
		animationSpeed : 300,
		simulateSlowBandwidth : false
	};
})(jQuery);
