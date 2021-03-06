// create venue model
var Venue = Backbone.Model.extend();

// create venues collection
var Venues = Backbone.Collection.extend({
	model: Venue
});

// create venueview w/tagName, click click, render name
var VenueView = Backbone.View.extend({
	tagName: 'li',

	events: {
		click: 'onClick'
	},
	// bus was passed down from 'VenuesView'
	initialize: function(options) {
		this.bus = options.bus;
	},
	// onClick we trigger an event o nthe bus object
	onClick: function() {
		// trigger the event 'venueSelected' on the bus and pass on the the model data
		this.bus.trigger('venueSelected', this.model);
	},
	render: function() {
		this.$el.html(this.model.get('name'));

		return this;
	}
});

// create venuesview w/ tagName, render each venue
var VenuesView = Backbone.View.extend({
	tagName: 'ul',

	id: 'venues',

	initialize: function(options) {
		this.bus = options.bus;
	},
	render: function() {
		var self = this;

		this.model.each(function(venue) {
			// passing the bus down to venueView which needs access to bus
			// bus needs to be initialized first
			var venueView = new VenueView({ model: venue, bus: self.bus });
			self.$el.append(venueView.render().$el);
		});

		return this;
	}
});
// create mapview w/ el: #map-container
// render html in #venue-name model's name
var MapView = Backbone.View.extend({
	el: '#map-container',
	initialize: function(options) {
		// give access to the bus
		this.bus = options.bus;
		// listen for 'venueSelected' event on this bus
		this.bus.on('venueSelected', this.onVenueSelected, this);
	},
	onVenueSelected: function(venue) {
		// set the model to venue
		this.model = venue;
		this.render();
	},
	// if a model has been selected
	// in this element find find '#venue-name' and add t he model name to the html
	render: function() {
		if (this.model) {
			this.$('#venue-name').html(this.model.get('name'));
		}
		return this;
	}
});

// create a bus and give it 'Backbone.Events'
var bus = _.extend({}, Backbone.Events);

// the venues
var venues = new Venues([
	new Venue({ name: '30 Mill Espresso' }),
	new Venue({ name: 'Platform Espresso' }),
	new Venue({ name: 'Mr Foxx' })
]);

// create instance of venuesview
// bus allows for communication between views
var venuesView = new VenuesView({ model: venues, bus: bus });
// render instance element in #venues-container
$('#venues-container').html(venuesView.render().$el);

// create map instance
var mapView = new MapView({ bus: bus });
// render map instance
mapView.render();
