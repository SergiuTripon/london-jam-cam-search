// variable to hold app id
var app_id = 'app_id=ee84c96b';
// variable to hold app key
var app_key = 'app_key=3aa60311a1e7234f876e281f65056dbe';

// variable to hold place types
var place_types = "JamCam";

// variable to hold error status
var form_error = false;

// variable to hold search submit
var submit_search = $("#submit-search");

// on search submit click event
submit_search.click(function (e) {
    e.preventDefault();

    submit_search.html("Working on it...");

    // check place name is inputted
    var place_name = $('#place-name');
    var place_name_value = place_name.val();
    if (place_name_value === '') {
        place_name.focus();
        place_name.popover("dispose");
        place_name.popover({
            html: true,
            trigger: "manual",
            placement: "bottom",
            content: "<span class='text-danger'>Please enter the name of a place in London.</span>"
        }).popover("show");
        submit_search.html("Search");
        form_error  = true;
        return false;
    } else {
        place_name.popover("dispose");
        form_error  = false;
    }

    // if there are no errors, initialize the ajax call
    if (form_error === false) {
        $.ajax({
            // URL to GET data from
            url: 'https://api.tfl.gov.uk/Place/Search?name=' + place_name_value + '&types=' + place_types + '&' + app_id + '&' + app_key
        }).then(function(places) {
            // if places found
            if (places.length !== 0) {
                place_name.popover('dispose');
                $(".modal-body").remove();
                $('.modal-title').html((places.length === 1) ? places.length + ' Jam Cam found' : places.length + ' Jam Cams found');
                $.each(places, function(key, val) {
                    // variable to hold image modified date
                    var image_modified_date = moment(new Date(val.additionalProperties[1].modified)).format('DD/MM/YYYY HH:mm:ss');
                    // variable to hold video modified date
                    var video_modified_date = moment(new Date(val.additionalProperties[3].modified)).format('DD/MM/YYYY HH:mm:ss');
                    // populate data
                    $('.modal-header').after(
                        "<div class='modal-body'>" +
                        "<div>" +
                        "<table class='table table-vertical table-bordered'>" +
                        "<tbody>" +
                        "<tr><th class='table-active'>Place</th><td>"       + val.commonName                    + "</td></tr>" +
                        "<tr><th class='table-active'>Latitude</th><td>"    + val.lat                           + "</td></tr>" +
                        "<tr><th class='table-active'>Longitude</th><td>"   + val.lon                           + "</td></tr>" +
                        "<tr><th class='table-active'>Camera view</th><td>" + val.additionalProperties[3].value + "</td></tr>" +
                        "</tbody>" +
                        "</table>" +
                        "</div>" +
                        "<div class='row'>" +
                        "<div class='col-lg-6 text-center'>" +
                        "<figure id='image' class='figure m-0'>" +
                        "<img src='" + val.additionalProperties[1].value + "' class='figure-img img-fluid' alt=''>" +
                        "<figcaption class='figure-caption'>" + image_modified_date + "</figcaption>" +
                        "</figure>" +
                        "</div>" +
                        "<div class='col-lg-6 text-center'>" +
                        "<figure id='video' class='figure m-0'>" +
                        "<video class='figure-img d-block' poster='" + val.additionalProperties[1].value + "' controls width='100%' height='100%' style='width: 100%; height: 100%;'>" +
                        "<source src='" + val.additionalProperties[2].value + "' type='video/mp4'>" +
                        "</video>" +
                        "<figcaption class='figure-caption'>" + video_modified_date + "</figcaption>" +
                        "</figure>" +
                        "</div>" +
                        "</div>" +
                        "</div>"
                    );
                });
                $('.modal').modal('show');
                submit_search.html('Search');
            // if places not found
            } else {
                place_name.popover({
                    html: true,
                    trigger: 'manual',
                    placement: 'bottom',
                    content: "<span class='text-danger'>We couldn't find any jam cams at or nearby this place. Please try searching for a different one.</span>"
                }).popover('show');
                submit_search.html('Search');
            }
        })
    }
    return true;
});