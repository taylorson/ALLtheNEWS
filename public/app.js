function displayResults(data) {
    $.each(data, function(i, res) {

        var newsData = [{
            title: res.title,
            description: res.description,
            link: res.link
        }];

        var data = {
            newsLinks: []
        };

        for (var i = 0; i < newsData.length; i += 1) {
            var currentNewsLink = newsData[i];

            if (currentNewsLink.title) {
                data.newsLinks.push(currentNewsLink);
            }
        }
        console.log(newsData);
        res.render("home", data);
        // $("tbody").append("<tr><td>" + res.title + "</td>" + "<td>" + res.description + "</td>" + "<td>" + res.link + "</td>");
    })
}

$.getJSON("/all", function(data) {
    // Call our function to generate a table body
    displayResults(data);
});