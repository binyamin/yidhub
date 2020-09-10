const users = require("./usernames.json");
const axios = require("axios").default;

const datacache = require("@binyamin/data-cache");

module.exports = async () => {
    let userArray = [];

    for (uname of users) {
        let userdata = datacache.get("users."+uname);

        if(!userdata) {
            const {data} = await axios.get("https://api.github.com/users/"+uname);
            datacache.set(
                "users."+uname,
                {
                    links: {
                        github: data.login,
                        twitter: data.twitter_username,
                        site: data.blog
                    },
                    name: data.name,
                    avatar: data.avatar_url,
                    bio: data.bio,
                    location: data.location,
                    public_repos: data.public_repos
                }
            );
            userdata = data;
        }        

        userArray.push(userdata);
    }

    return userArray;
}