var Campgrounds = require('./models/campground');
var Comments = require('./models/comment');

var data = [{
		name: "Clouds Rest",
		image: "/images/seed/seed-img-1.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	
	{
		name: "Desert Mesa",
		image: "/images/seed/seed-img-2.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Canyon Floor",
		image: "/images/seed/seed-img-3.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Great Mountain",
		image: "/images/seed/seed-img-4.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
]

var campAuthor = {
	"Clouds Rest": "Someone",
	"Desert Mesa": "Clare",
	"Canyon Floor": "ArnoldJames",
	"Great Mountain": "whitesharK123"
}

var commGenerator = {
	"Clouds Rest": {
		name: "Homer",
		text: "Beautiful place but I wish there was internet"
	},
	"Desert Mesa":{
		name: "RandomGuy",
		text: "I liked it"
	},
	"Canyon Floor":{
		name: "LokoLoko",
		text: "Its pretty meh"
	},
	"Great Mountain":{
		name: "MariaSmith67",
		text: "it was one of the more beautiful places i´ve ever been"
	}
}

function seedDB() {
	//for callbacks count
	var counter = 0;
	//remove all comments ( they are a different collection referenced by campgrounds )
	Comments.remove({}, function (err) {
		if (err) console.log(err);
		else {
			console.log("Removed old comments")
			//remove all campgrounds
			Campgrounds.remove({}, function (err) {
				if (err) console.log(err);
				else {
					console.log("Removed old campgrounds!");

					//add some campgrounds
					data.forEach(function (seed) {
						Campgrounds.create(seed, function (err, campground) {
							if (err) console.log(err);
							else {
								//add campground submitter
								campground.author.username = campAuthor[campground.name];
								campground.author.id = "5b80687cc85de04e68d0b301";
								campground.price = "9.00";
								console.log(campground.name, "added!!");
								Comments.create({
									text: commGenerator[campground.name].text
								}, function (err, comment) {
									if (err) console.log(err);
									else {
										//add comment author
										comment.author.username = commGenerator[campground.name].name;
										comment.author.id = "5b80687cc85de04e68d0b301";
										comment.save();
										//add comment reference to campground
										campground.comments.push(comment);
										campground.save();
										console.log("Added new comment for:", campground.name);
										counter++;
										if(counter == 4){
											setTimeout(()=>console.log("SEED COMPLETE!!!"), 1000);
											counter = 0;
										}
									}
								})
							}
						});
					});
				}
			});
		}
	});
}

module.exports = seedDB;