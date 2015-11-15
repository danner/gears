var transmissions = [
	{
		name: "t56-short",
		gears: [2.66, 1.73, 1.3, 1.0, 0.8, 0.62]
	},
	{
		name: "NA8A",
		gears: [ 3.136, 1.888, 1.33, 1.0, 0.814]
	},

];

var engines = [
	{
	name: "simple",
	dyno: 
[		{torque: 0, rpm: 0},
		{torque: 350, rpm: 1500},
		{torque: 390, rpm: 4700},
		{torque: 407, rpm: 5300},
		{torque: 350, rpm: 6500},
		{torque: 0, rpm: 7000}
	]
	},	{
	name: "danner's motor",
	dyno: [
		{torque: 0, rpm: 0},
		{torque: 350, rpm: 1500},
		{torque: 390, rpm: 4700},
		{torque: 407, rpm: 5300},
		{torque: 350, rpm: 6500},
		{torque: 0, rpm: 7000}
	]
	},

];

var drivetrains = [
	{
		name: "8.8 torsen 2",
		final_drive: 3.07,
		losses: 0.15
	},
	{
		name: "miata torsen",
		final_drive: 4.1,
		losses: 0.15
	}
];

var wheels = [
	{	
		name: "cobra blah",
		diameter: 25.7,
		revs_per_mile: 808
	},
	{
		name: "94 miata summer",
		diameter: 21.7,
		revs_per_mile: 930
	}
];