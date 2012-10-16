$g = $g || {};
$g.data = $g.data || {};
$g.data.transmission = $g.data.transmission || {};
$g.data.engine = $g.data.engine || {};
$g.data.drivetrain = $g.data.drivetrain || {};
$g.data.wheel = $g.data.wheel || {};

$g.data.transmission.t56short = new $g.TransmissionModel({
	gears: [2.66, 1.73, 1.3, 1.0, 0.8, 0.62]
});

$g.data.engine.sbf347 = new $g.EngineModel({
	dyno: new $g.DynoCollection([
		new $g.DynoPointModel({torque: 0, rpm: 0}),
		new $g.DynoPointModel({torque: 250, rpm: 1500}),
		new $g.DynoPointModel({torque: 450, rpm: 5300}),
		new $g.DynoPointModel({torque: 350, rpm: 6500}),
		new $g.DynoPointModel({torque: 0, rpm: 7000})
	])
});

$g.data.drivetrain.custom = new $g.DrivetrainModel({
	final: 3.07,
	losses: 0.15
});

$g.data.wheel.custom = new $g.WheelModel({
	diameter: 25.7,
	revs_per_mile: 808
});