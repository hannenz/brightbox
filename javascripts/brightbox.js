/*
 * brightbox.js
 * 
 * A simple jQuery lightbox plugin for prototyping. No images needed, all done in CSS(3) - will be ugly in ancient browsers.... won't test
 * 
 * 2012
 * Johannes Braun <j.braun@agentur-halma.de>
 * 
 * Markup:
 * 
 * <a class="brightbox" href="an-image.jpg" title="Description of an image"><img src="thumbnail-or-image.jpg" alt="" /></a>
 * <a class="brightbox" href="another-image.jpg" title="Description of another image"><img src="thumbnail-or-image.jpg" alt="" /></a>
 * ...
 * 
 * JS:
 * var options = { ... };
 * $('.brightbox').brightbox(options);
 * 
 * Options:
 * overlayBgColor string		CSS color description to use for the overlay
 * boxPadding number			Padding of the brightbox box in px (The "white border around the image);
 * 
 * CSS:
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
		var busy = $('<div class="brightbox-busy">Loading...</div>');
		var current = 0;
		var imageLinks = this;
		var image;

		box.css({
			'padding' : options['boxPadding'],
			'width' : 300,
			'height' : 200,
			'top' : ($(window).height() - 200) / 2,
			'left' : ($(window).width() - 300) / 2,
		}).appendTo(overlay);
		
		overlay.css({
			'background-color' : options['overlayBgColor'],
		});

		function closeBrightBox(){
			$('.brightbox-overlay').hide();
			box.empty();
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
			}
		});

		function showBrightBox(imageURL, title){
			if ($('body > .brightbox-overlay').length == 0){
				$('body').prepend(overlay);
				if (options['closeOnOverlayClick']){
					overlay.bind('click', closeBrightBox);
				}
			}
			overlay.show();
			$('.brightbox-info-box').remove();

			close.bind('click', function(event){
				event.preventDefault();
				event.stopPropagation();
				closeBrightBox();
			});
			next.bind('click', function(event){
				event.preventDefault();
				event.stopPropagation();
				nextBrightBox();
			});
			prev.bind('click', function(event){
				event.preventDefault();
				event.stopPropagation();
				prevBrightBox();
			});
			
			image = new Image();
			image.src = imageURL;
			box.append(busy);

			image.onload = function(){
				if (image.height > $(window).height()){
					var ratio = image.width / image.height;
					image.height = $(window).height() - 50;
					image.width = image.height * ratio;
				}
				
				$(image).bind('click', function(event){
					event.preventDefault();
					event.stopPropagation();
					
					if (options['onImageClick']){
						options['onImageClick'](imageURL);
					}
					return false;
				});

				var newCss = {
					'top' : ($(window).height() - image.height) / 2,
					'left' : ($(window).width() - image.width) / 2,
					'width' : image.width,
					'height' : image.height
				};
				
				
				if (options['animate'] == true){
					box.animate(
						newCss ,
						options['animationSpeed'],
						afterApply
					);
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
			}
		}
	};

	$.fn.brightbox.defaults = {
		overlayBgColor : 'rgba(0, 0, 0, 0.8)',
		boxPadding : '10px',
		animate : true,
		animationSpeed : 300,
		closeOnOverlayClick : true,
	};
})(jQuery);

	
