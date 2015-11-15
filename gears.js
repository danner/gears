angular.module('gears', []);

// $g.slider = function(el, args){
//     defaults = {
//         animate: true,
//         range: "min",
//         value: 50,
//         min: 0,
//         max: 100,
//         step: 1,

//         //this gets a live reading of the value and prints it on the page
//         slide: function( event, ui ) {
//             $(el).children(".slider-result").html( ui.value );
//         },

//         change: function(event, ui) {
//             console.log(event, ui);
//         }
//     };
//     //update defaults with any passed in options
//     args = _.extend(defaults, args);
//     //and make the slider
//     $(el).slider(args);
// };
// $g.lerp = function(a, b, t) {
//     var len = a.length;
//     if(b.length != len) return;

//     var x = [];
//     for(var i = 0; i < len; i++)
//         x.push(a[i] + t * (b[i] - a[i]));
//     return x;
// };

// $g.DynoPointModel = Backbone.Model.extend({
//     //rpm, torque
//     initialize: function(){
//         _.bindAll(this,
//             'hp'
//         );
//         this.set('hp', this.hp());
//     },
//     hp: function(){
//         return this.get('torque') * this.get('rpm') / 5252;
//     }
// });
// $g.DynoCollection = Backbone.Collection.extend({
//     comparator: function(point){
//         return -point.rpm;
//     }
// });
// $g.EngineModel = Backbone.Model.extend({
//     initialize: function(){
//         _.bindAll(this,
//             'torque',
//             'hp',
//             'torque_series',
//             'hp_series',
//             'max_rpm'
//         );
//     },
//     //list of rpms to hp.
//     torque: function(rpm){
//         var insertionIndex = _.sortedIndex(this.dyno, rpm, function(point){return point.get('rpm');});
//         var larger = this.dyno.at(insertionIndex);
//         var smaller;
//         if(larger.get('rpm') == rpm){
//             //exact match? take it.
//             return larger.get('torque');
//         }else if(insertionIndex === 0){
//             //lower than low
//             alert("lower than lowest possible torque value. impressive.");
//             return 0;
//         }else if(insertionIndex >= this.dyno.length){
//             //higher than high
//             alert("inaccurate torque at this rpm");
//             return larger.get('torque');
//         }else{
//             //between two values
//             smaller = this.dyno.at(insertionIndex-1);
//             var step = larger - smaller;
//             var ratio = rpm-smaller/step;
//             return $g.lerp(smaller, larger, ratio);

//         }
//     },
//     rpm_series: function(){
//         this.get('dyno').map(function(point){
//             return point.get('rpm');
//         });
//     },
//     torque_series: function(){
//         //gives back torque in [[rpm, torque], [rpm2, torque2]]
//         return this.get('dyno').map(function(point){
//             return point.get('torque');
//         });
//     },
//     hp: function(rpm){
//         return this.torque(rpm) * rpm / 5252;
//     },
//     hp_series: function(){
//         //gives back torque in [[rpm, torque], [rpm2, torque2]]
//         return this.get('dyno').map(function(point){
//             return point.get('hp');
//         });
//     },
//     max_rpm: function(){
//         return this.get('dyno').last().get('rpm');
//     }
// });
// $g.CarModel = Backbone.Model.extend({
// // MPH function receives RPM, Tire, TRatio, RearRatio and returns MPH
// // Tire is in inch diameter.
//     mph: function(rpm, tire, t_ratio, rear_ratio) {
//         return (rpm*tire)/(t_ratio*rear_ratio*336);
//     },
//     rpm_series: function(){
//         var redline = this.get('engine').max_rpm();
//         return _.range(0, redline+100, 200);
//     },
//     gear_series: function(t_ratio){
//         //chart the mph of gear ratios through the rpm range of the engine
//         var redline = this.get('engine').max_rpm();
//         var tire = this.get('wheel').get('diameter');
//         var rear_ratio = this.get('drivetrain').get('final');
//         var self = this;
//         return self.rpm_series().map(function(rpm){
//             return self.mph(rpm, tire, t_ratio, rear_ratio);
//         });
//     },
//     gear_chart_series: function(){
//         var self = this;
//         return this.get('transmission').get('gears').map(function(ratio, gear_number){
//             return ['gear '+(gear_number+1)].concat(self.gear_series(ratio));
//         });
//     }
// });

// //***********
// //   Views
// //***********
// $g.transmissionView = Backbone.View.extend({
//     //controls the forms for the transmission.
//     el: 'ol.transmissionform',
//     events: {
//         'mouseup .transmissionform': 'change_gear_ratio'
//     },
//     initialize: function(){
//         _.bindAll(this,
//             'change_gear_ratio'
//         );
//         this.transmission = this.options.transmission;
//     },
//     render: function() {
//         this.$el.html("");
//         var self = this;
//         _.each(this.transmission.get('gears'), function(gear, name) {
//             //probably split out into function.
//             self.$el.append("<li class='slider gear-"+name+"'><div class='slider-result'>"+gear+"</div></li>");
//             $g.slider(self.$('li.gear-'+name), {
//                 max: 3.0,
//                 step: 0.01,
//                 value: gear,
//                 change: self.change_gear_ratio
//             });
//         });
//     },
//     change_gear_ratio: function(event, ui){
//         var gear_element = $(ui.handle).parent();
//         var gears = this.transmission.get('gears');
//         var index = gear_element.index('li');
//         gears[index] = ui.value;
//         this.transmission.set('gears', gears);
//     }
// });



// $g.SimulationView = Backbone.View.extend({
// //controls the overall actions of the page.
//     initialize: function(){
//         _.bindAll(this,
//             'render_charts',
//             'render_dynochart'
//         );

//         //gather up an initial set of models
//         this.car = this.options.car;
//         this.transmission_view = new $g.transmissionView({transmission: this.car.get('transmission')});
//         this.transmission_view.render();
//         this.render_charts();

//         this.car.get('transmission').bind('change', this.render_charts, this);
//     },
//     render_charts: function(){
//         this.render_dynochart(this.car.get('engine'));
//         this.render_gearchart(
//             this.car.get('engine'),
//             this.car.get('transmission'),
//             this.car.get('drivetrain'),
//             this.car.get('wheel')
//         );
//     },
//     render_dynochart: function(engine){
//         var chart = c3.generate({
//             bindto: '#dynochart',
//             data: {
//                 x: 'rpm',
//                 columns: [
//                     ['rpm'].concat(this.car.rpm_series()),
//                     ['Torque'].concat(engine.torque_series()),
//                     ['Horsepower'].concat(engine.hp_series())
//                 ]
//             }
//         });
//     },
//     render_gearchart: function(engine, transmission, drivetrain, wheel){
//         console.log(engine.max_rpm());
//         var chart = c3.generate({
//             bindto: '#gearchart',
//             data: {
//                 x: 'rpm',
//                 columns: [['rpm'].concat(this.car.rpm_series())].concat(this.car.gear_chart_series())
//             },
//             grid: {
//                 x: {
//                     lines: [{value: engine.max_rpm(), text: 'Redline'}]
//                 }
//             }
//         });
//     }
// });
