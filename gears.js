var $g = $g || {};

$g.TransmissionModel = Backbone.Model.extend({
     //gears 1-7.
    // initialize: function(){
    //     _.bindAll(this,
    //     );
    // }
});

$g.DrivetrainModel = Backbone.Model.extend({
     //final drive, losses, wheel size
});

$g.WheelModel = Backbone.Model.extend({
    //diameter at least.
});

$g.DynoPointModel = Backbone.Model.extend({
    //rpm, torque
    initialize: function(){
        _.bindAll(this,
            'hp'
        );
        this.set('hp', this.hp());
    },
    hp: function(){
        return this.get('torque') * this.get('rpm') / 5252;
    }
});
$g.DynoCollection = Backbone.Collection.extend({
    comparator: function(point){
        return -point.rpm;
    }
});
$g.EngineModel = Backbone.Model.extend({
    initialize: function(){
        _.bindAll(this,
            'torque',
            'hp',
            'torque_series',
            'hp_series',
            'max_rpm'
        );
    },
    //list of rpms to hp.
    torque: function(rpm){
        var insertionIndex = _.sortedIndex(this.dyno, rpm, function(point){return point.get('rpm')});
        var larger = this.dyno.at(insertionIndex);
        var smaller;
        if(larger.get('rpm') == rpm){
            //exact match? take it.
            return larger.get('torque');
        }else if(insertionIndex == 0){
            //lower than low
            alert("lower than lowest possible torque value. impressive.");
            return 0;
        }else if(insertionIndex >= this.dyno.length){
            //higher than high
            alert("inaccurate torque at this rpm");
            return larger.get('torque');
        }else{
            //between two values
            smaller = this.dyno.at(insertionIndex-1);
            //linear interpolate
        }
    },
    torque_series: function(){
        //gives back torque in [[rpm, torque], [rpm2, torque2]]
        return this.get('dyno').map(function(point){
            var plot = [point.get('rpm'), point.get('torque')];
            return plot;
        }).reverse();
    },
    hp: function(rpm){
        return this.torque(rpm) * rpm / 5252;
    },
    hp_series: function(){
        //gives back torque in [[rpm, torque], [rpm2, torque2]]
        return this.get('dyno').map(function(point){
            var plot = [point.get('rpm'), point.get('hp')];
            return plot;
        }).reverse();
    },
    max_rpm: function(){
        return this.get('dyno').last().get('rpm');
    }
});
$g.CarModel = Backbone.Model.extend({
// MPH function receives RPM, Tire, TRatio, RearRatio and returns MPH
// Tire is in inch diameter.
    mph: function(rpm, tire, t_ratio, rear_ratio) {
        return (rpm*tire)/(t_ratio*rear_ratio*336);
    },
    gear_series: function(t_ratio){
        //chart the mph of gear ratios through the rpm range of the engine
        var redline = this.get('engine').max_rpm();
        var tire = this.get('wheel').get('diameter');
        var rear_ratio = this.get('drivetrain').get('final');
        var self = this;
        return _.range(0, redline+redline/30, redline/30).map(function(rpm){
            return [rpm, self.mph(rpm, tire, t_ratio, rear_ratio)];
        });
    },
    gear_chart_series: function(){
        var self = this;
        return this.get('transmission').get('gears').map(function(ratio, gear_number){
            return {
                name: gear_number+1,
                data: self.gear_series(ratio)
            }
        })
    }
});
$g.SimulationView = Backbone.View.extend({
//controls the overall actions of the page.
    initialize: function(){
        _.bindAll(this,
            'render_charts',
            'render_dynochart'
        );
        //gather up an initial set of models
        this.car = this.options.car;
        console.log(this.car.toJSON());
        this.render_charts();
    },
    render_charts: function(){
        this.render_dynochart(this.car.get('engine'));
        this.render_gearchart(
            this.car.get('engine'),
            this.car.get('transmission'),
            this.car.get('drivetrain'),
            this.car.get('wheel')
        );
    },
    render_dynochart: function(engine){
        this.dynochart = new Highcharts.Chart({
            chart: {
                renderTo: 'dynochart',
                type: 'line'
            },
            title: {
                text: 'Dyno Chart'
            },
            xAxis: {
                title: {
                    text: 'RPM'
                }
            },
            yAxis: {
                title: {
                    text: 'Torque/HP'
                }
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: true,
                    }
                }
            },
            series: [
                {
                    name: 'Torque',
                    data: engine.torque_series()
                }, {
                    name: 'Horsepower',
                    data: engine.hp_series()
                }
            ]
        });
    },
    render_gearchart: function(engine, transmission, drivetrain, wheel){
        console.log("rendering");
        this.gearchart = new Highcharts.Chart({
            chart: {
                renderTo: 'gearchart',
                type: 'line'
            },
            title: {
                text: 'Gear Chart'
            },
            xAxis: {
                title: {
                    text: 'RPM'
                }
            },
            yAxis: {
                title: {
                    text: 'Speed mph'
                }
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: true,
                    }
                }
            },
            series: this.car.gear_chart_series()
            //one series per gear?
            //speed? RPM?
        });
    }
});