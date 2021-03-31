const users = require("./usernames.json");
const axios = require("axios").default;
const datacache = require("@binyamin/data-cache");

module.exports = async () => {
    let userArray = [];

    for (uname of users) {
        let userdata = datacache.get("users."+uname);

        if(!userdata) {
            const {data} = await axios.get("https://api.github.com/users/"+uname);

            userdata = {
                links: {
                    github: data.login,
                    twitter: data.twitter_username,
                    site: (() => {
                        let l = data.blog || null;
                        if(l && l.startsWith("http") === false) {
                            l = "http://" + l;
                        }
                        return l;
                    })()
                },
                name: data.name,
                avatar: data.avatar_url,
                bio: data.bio,
                location: data.location
            };

            datacache.set( "users."+uname, userdata);
        }

        userArray.push(userdata);
    }

    return userArray;
}