/*
 * =====================================================================
 * brightbox.js
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
 * <a class="brightbox" href="an-image.jpg" title="Description of an image"><img src="thumbnail-or-image.jpg" alt="" /></a>
 * <a class="brightbox" href="another-image.jpg" title="Description of another image"><img src="thumbnail-or-image.jpg" alt="" /></a>
 * ...
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
 * 									callback_function(image, imageURL);
 * 
 * Stylesheet:
 * -----------
 * See brightbox.css and adjust to fit your needs
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
		var busy = $('<div class="brightbox-busy">Loading<span class="hellip"></span></div>');
		var current = 0;
		var imageLinks = this;
		var image;

		box.css({
			'width' : 300,
			'height' : 200,
			'top' : ($(window).height() - 200) / 2,
			'left' : ($(window).width() - 300) / 2
		}).appendTo(overlay);

		return this.each(function(){

			$(this).bind('click', onClick);
			
			function onClick(event){
				event.preventDefault();
				
				var imageURL = $(this).attr('href');
				for (var i = 0; i < imageLinks.length; i++){
					if (imageURL == $(imageLinks[i]).attr('href')){
						current = i;
						break;
					}
				}

				showBrightBox(imageURL, $(this).attr('title'));
				return false;
			}
		});

		
		function closeBrightBox(){
			$('.brightbox-overlay').hide();
			box.empty();
			$(window).unbind('keyup');
		}

		function nextBrightBox(){
			if (++current == imageLinks.length){
				current = 0;
			}
			var imageLink = imageLinks[current];
			var imageURL = $(imageLink).attr('href');
			box.empty();
			showBrightBox(imageURL, $(imageLink).attr('title'));
		}
		
		function prevBrightBox(){
			if (current == 0){
				current = imageLinks.length;
			}
			current--;
			var imageLink = imageLinks[current];
			var imageURL = $(imageLink).attr('href');
			box.empty();
			showBrightBox(imageURL, $(imageLink).attr('title'));
		}
		


		function onKeyUp(event){
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
			}
		}

		function showBrightBox(imageURL, title){
			if ($('body > .brightbox-overlay').length == 0){
				$('body').prepend(overlay);
				if (options['closeOnOverlayClick']){
					overlay.bind('click', closeBrightBox);
				}
			}
			overlay.show();
			$('.brightbox-info-box').remove();


			$(window).unbind('keyup');
			$(window).bind('keyup', onKeyUp);

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
					box.find('img').fadeOut(nextBrightBox);
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
					box.find('img').fadeOut(prevBrightBox);
				}
				else {
					box.find('img').show();
					prevBrightBox();
				}
				return false;
			});
			
			image = new Image();
			image.src = imageURL;
			box.append(busy);
			setTimeout(beBusy, 300);
			
			function beBusy(){
				var h = busy.find('.hellip');
				var t = h.html();
				if (t.length > 2){
					h.html('');
				}
				else {
					h.html(t + '.');
				}
				setTimeout(beBusy, 300);
			}

			image.onload = function(){
				if (image.height > $(window).height()){
					var ratio = image.width / image.height;
					image.height = $(window).height() - 50;
					image.width = image.height * ratio;
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
					'height' : parseInt(image.height)
				};
				
				if (options['animate'] == true){
					box.animate(newCss, options['animationSpeed'], afterApply);
				}
				else {
					box.css(newCss);
					afterApply();
				}
			}

			function afterApply(){
				box.empty().append(close);
				if (imageLinks.length > 1){
					box.append(next);
					box.append(prev);
				}
				box.append(image);

				if (title){
					var info = $('<div class="brightbox-info-box" />');
					info.append(title);
					box.append(info);
				}
				box.css('overflow', 'visible');
				options['animate'] ? box.find('img').fadeIn() : box.find('img').show();
			}
		}
	};

	$.fn.brightbox.defaults = {
		closeOnOverlayClick : true,
		animate : true,
		animationSpeed : 500
	};
})(jQuery);

	
