var Word = Backbone.Model.extend({
	move: function() {
		this.set({y: this.get('y') + this.get('speed') });
	}
});

var Words = Backbone.Collection.extend({
	model:Word
});

var WordView = Backbone.View.extend({
	initialize: function() {
		$(this.el).css({position:'absolute'});
		$(this.el).addClass('word_wrapper');

		var string = this.model.get('string');
		var letter_width = 25;
		var word_width = string.length * letter_width;

		if(this.model.get('x') + word_width > $(window).width()) {
			this.model.set({x:$(window).width() - word_width});
		}
		for(var i = 0;i < string.length;i++) {
			$(this.el)
				.append($('<div>')
					.css({
						width:letter_width + 'px',
						padding:'5px 2px',
						'border-radius':'4px',
						'background-color':'#fff',
						border:'1px solid #ccc',
						'text-align':'center',
						float:'left'
					})
					.text(string.charAt(i).toUpperCase()));
		}

		// Word wrapper width is fixed
		$(this.el).css({'width': word_width + 'px'});

		this.listenTo(this.model, 'remove', this.remove);

		this.render();
	},

	render:function() {
        
        // Manage how words fallin'
		$(this.el).css({
			left:this.model.get('x') + 'px',
			'animation-duration': this.model.get('trans_speed')+'s'
        });

		var highlight = this.model.get('highlight');

        // Chars coloring
		$(this.el).find('div').each(function(index, element) {
			if(index < highlight) {
				$(element).css({'font-weight':'bolder','background-color':'#aaa',color:'#fff'});
			} else {
				$(element).css({'font-weight':'normal','background-color':'#fff',color:'#000'});
			}
		});
	}
});

var TyperView = Backbone.View.extend({
	initialize: function() {
        // S:Main wrapper
		var wrapper = $('<div>')
			.css({
				position:'fixed',
				top:'0',
				left:'0',
				width:'100%',
				height:'100%'
			});
		this.wrapper = wrapper;
        this.wrapper.addClass('main_wrapper');  // By me
        // E:Main wrapper

		var self = this;

        // S:Text Field
		var text_input = $('<input>')
			.addClass('form-control')
			.css({
				'border-radius':'4px',
				position:'absolute',
				bottom:'0',
				'min-width':'80%',
				width:'80%',
				'margin-bottom':'10px',
				'z-index':'1000'
			}).keyup(function() {
                // Get company_names 
				var words = self.model.get('words');
				
				for(var i = 0;i < words.length;i++) {
					var word = words.at(i);
					var typed_string = $(this).val();
					var string = word.get('string'); // Company name 
					if(string.toLowerCase().indexOf(typed_string.toLowerCase()) == 0) {

						// Highlight chars
						word.set({highlight:typed_string.length});

                        // model.word string length equal to typed word
						if(typed_string.length == string.length) {
							$(this).val('');
                            
                            // Add score by count chars length
                            var current_score = self.model.get('score_current') + string.length;
                            self.model.set('score_current', current_score);
                            
                            // Update score view
                            $('div#nav_control a.scoreText').text("Your score - " + current_score);
                            

						}
					// HAndle miss typed char and substract score by three
					} else if(word.get('highlight') >= 3) {
                        word.set({highlight:0});

                        // Substract score by 3
                        var current_score = 0;
                        var score_subs = 3;
                        if (self.model.get('score_current') >= score_subs) {
                        	current_score = self.model.get('score_current') - score_subs;
                        	self.model.set('score_current', current_score);

                        	// Update score view
                        	$('div#nav_control a.scoreText').text("Your score - " + current_score);
                    	}

                    	// Clear input
                    	$(this).val('');                        

					} else {
						word.set({highlight:0});
					}
				}
			});
        // E:Text Field

        // S: Navigation for control
        var nav_control = $('<div>')
            .attr({'id': 'nav_control'});

        // Start and Stop button control
        var startStop_ctrl = $('<a>').text('STOP')
        	.attr({'href': '#startStop', 'title': 'Stop the Game'})
            .addClass('startStop_ctrl');

        // Score (logo) button
        var brandLogo = $('<a>').text('Q')
        	.attr({'href': 'http://www.qerja.com', 'title': 'Qerja Homepage'})
            .addClass('brandLogo_btn');

        // Pause and Resume button control
        var pauseResume_ctrl = $('<a>').text('PAUSE')
        	.attr({'href': '#pauseResume', 'title': 'Pause the Game'})
            .addClass('pauseResume_ctrl');
        
        // Score text
        var scoreText = $('<a>').text('Typer')
            .addClass('scoreText');

        nav_control
            .append(brandLogo)
            .append(scoreText)
            .append(pauseResume_ctrl)
            .append(startStop_ctrl);
        // E: Navigation for control        

		$(this.el)
			.append(wrapper
                .append(nav_control)
				.append($('<form>')
					.attr({
						role:'form'
					})
					.submit(function() {
						return false;
					})
					.append(text_input)));

		text_input.css({left:((wrapper.width() - text_input.width()) / 2) + 'px'});
		text_input.focus();

		this.listenTo(this.model, 'change', this.render);
	},

	render: function() {
		var model = this.model;
		var words = model.get('words');

		for(var i = 0;i < words.length;i++) {
			var word = words.at(i);
			if(!word.get('view')) {
				var word_view_wrapper = $('<div>');
				this.wrapper.append(word_view_wrapper);
				word.set({
					view:new WordView({
						model: word,
						el: word_view_wrapper
					})
				});
			} else {
				word.get('view').render();
			}
		}
	}
});

var Typer = Backbone.Model.extend({
	defaults:{
		max_num_words: 10,
		min_distance_between_words: 50,
		words: new Words(),
		min_speed: 1,
		max_speed: 1,
		timer: null,  // Interval container
        score_high: 0,
        score_current: 0
	},

	initialize: function() {
		new TyperView({
			model: this,
			el: $(document.body)
		});
	},

	// Fungsi yang pertama dijalankan
	start: function() {
		// Check whether the timer equivalent to null
		if (this.get('timer') !== null) {
			console.log("Timer is null");
			return;
		}

		var animation_delay = 100;  // Edited from 100
		var self = this;

		this.set('timer', setInterval(function() {
				self.iterate();
			}, animation_delay)
		);
	},

	// Stop setInterval
	stop: function() {
		console.log("Typer will be stopped.");
		clearInterval(this.get('timer'));
  		this.set('timer', null);
        
        $('div#nav_control a.scoreText').text('Typer');
	},
    
    pause: function() {
        console.log("Typer will be paused.");
		clearInterval(this.get('timer'));
  		this.set('timer', null);
    },
    
    // Get Score
    getScore: function() {
        var scores = [this.get('score_current'), this.get('score_high')];
        return scores;
    },

    // Set score
    setScore: function(scores) {
        // Set high score if current score is bigger
        if (scores[0] > scores[1]) {
            this.set('score_high', scores[0])
        }
        
        // Revert current score
        this.set('score_current', 0)
    },
    
	iterate: function() {
		var words = this.get('words');

		if(words.length < this.get('max_num_words')) {

			var top_most_word = undefined;

			for(var i = 0;i < words.length;i++) {
				var word = words.at(i);
				if(!top_most_word) {
					top_most_word = word;
				} else if(word.get('y') < top_most_word.get('y')) {
					top_most_word = word;
				}
			}

			if(!top_most_word || top_most_word.get('y') > this.get('min_distance_between_words')) {
                // Rendomly get company_names data
				var random_company_name_index = this.random_number_from_interval(0, company_names.length - 1);

				// Array animation duration for css3 animation
				var animation_speeds = [20, 30, 35]

				var string = company_names[random_company_name_index];
				var filtered_string = '';
				for(var j = 0; j < string.length; j++) {
					if(/^[a-zA-Z()]+$/.test(string.charAt(j))) {
						filtered_string += string.charAt(j);
					}
				}

                // Word properties
				var word = new Word({
					x:this.random_number_from_interval(0, $(window).width()),
					y:0,
					string:filtered_string,					
                    speed:this.random_number_from_interval(this.get('min_speed'),this.get('max_speed')),
                    trans_speed: animation_speeds[this.random_number_from_interval(0, animation_speeds.length)],
                    h_score: this.get('score_high'),
                    current_score: this.get('score_current')
                });
				words.add(word);
			}
		}

		var words_to_be_removed = [];

		for(var i = 0;i < words.length;i++) {
			var word = words.at(i);

			word.move();

            // Remove DOM
			if(word.get('y') > $(window).height() || word.get('move_next_iteration')) {
				words_to_be_removed.push(word);
			}

            // Berhasil dapat poin
			if(word.get('highlight') && word.get('string').length == word.get('highlight')) {
				word.set({
                    move_next_iteration:true,
                    h_score: word.get('h_score') + 1,
                    current_score: word.get('current_score') + 1
                });
			} 
		}

		for(var i = 0; i < words_to_be_removed.length; i++) {
			words.remove(words_to_be_removed[i]);
		}

		this.trigger('change');
	},

	random_number_from_interval: function(min,max) {
	    var x = Math.floor(Math.random()*(max-min+1)+min);
        return x;

	}
});
