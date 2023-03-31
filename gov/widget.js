/**
 * Created by Rob Beaty on 2/29/16.
 * OCV Blog Feed Widget
 */
function ocvFeedWidget() {
  var _args = {}; // config args

  // Localize jQuery variable
  var jQuery;
  var jQueryVer = /^2/;

  return {
    init: function (Args) {
      _args = Args;
      // set up loader gif
      var loader = document.createElement("div");
      loader.id = _args["container"] + "-loader";
      loader.style.background =
        "url('//s3.amazonaws.com/myocv/ocvapps/ocv-files/feed-widget/img/page-loader.gif') 50% 50% no-repeat rgb(249,249,249)";
      loader.style.width = "100%";
      loader.style.minHeight = "300px";
      loader.style.zIndex = 9999;
      var container = document.getElementById(_args["container"]);
      container.appendChild(loader);
    },
    gen: function () {
      // get config values
      var width = _args["width"];
      if (width == "responsive") {
        width = "100%";
      } else {
        width = width + "px";
      }
      var height = _args["min-height"];
      var URL = _args["URL"];
      var container = _args["container"];
      var limit;
      if (_args["limit"] !== undefined) {
        limit = _args["limit"];
      } else {
        limit = undefined;
      }
      if (_args["showDate"] !== undefined) {
        if (_args["showDate"] == true) {
          showDate = true;
        } else if (_args["showDate"] == false) {
          showDate = false;
        } else {
          showDate = true;
        }
      } else {
        showDate = true;
      }
      var carousel = _args["carousel"];
      var type;
      if (_args["type"] !== undefined) {
        type = _args["type"];
      } else {
        type = "blog";
      }

      /******** Load jQuery if not present *********/
      if (window.jQuery === undefined) {
        var script_tag = document.createElement("script");
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute(
          "src",
          "//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"
        );
        if (script_tag.readyState) {
          script_tag.onreadystatechange = function () {
            // For old versions of IE
            if (this.readyState == "complete" || this.readyState == "loaded") {
              scriptLoadHandler();
            }
          };
        } else {
          script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (
          document.getElementsByTagName("body")[0] || document.documentElement
        ).appendChild(script_tag);
      } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        setTimeout(function () {
          loadFeatherLight();
        }, 2000);
        main();
      }

      function loadFeatherLight() {
        /******** Load featherlight if not present *********/
        if (window.featherlight === undefined) {
          var script_tag = document.createElement("script");
          script_tag.setAttribute("type", "text/javascript");
          script_tag.setAttribute(
            "src",
            "//s3.amazonaws.com/myocv/ocvapps/ocv-files/feed-widget/featherlight/featherlight.min.js"
          );
          // Try to find the head, otherwise default to the documentElement
          (
            document.getElementsByTagName("body")[0] || document.documentElement
          ).appendChild(script_tag);
        }
      }

      function loadListJs() {
        /******** Load List.js *********/
        var script_tag = document.createElement("script");
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute(
          "src",
          "//s3.amazonaws.com/myocv/ocvapps/ocv-files/feed-widget/listjs/list.min.js"
        );
        // Try to find the head, otherwise default to the documentElement
        (
          document.getElementsByTagName("body")[0] || document.documentElement
        ).appendChild(script_tag);
      }

      /******** Called once jQuery has loaded ******/
      function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict();
        // load featherlight lightbox
        setTimeout(function () {
          loadFeatherLight();
        }, 2000);
        // Call our main function
        main();
      }

      /******** Our main function ********/
      function main() {
        //loadListJs();
        jQuery(document).ready(function ($) {
          /******* Load CSS *******/
          var css_link = $("<link>", {
            rel: "stylesheet",
            type: "text/css",
            href: "//s3.amazonaws.com/myocv/ocvapps/ocv-files/feed-widget/ocv-feed-widget-v2.css",
          });
          css_link.appendTo("head");
          var css_link_fl = $("<link>", {
            rel: "stylesheet",
            type: "text/css",
            href: "//s3.amazonaws.com/myocv/ocvapps/ocv-files/feed-widget/featherlight/featherlight.min.css",
          });
          css_link_fl.appendTo("head");

          /******* Create Container *******/
          jQuery("#" + container).css({
            "width": width,
            "min-height": height + "px",
          });

          /******* Get Feed Data *******/
          jQuery.get(URL, function (feed) {
            // clear loader
            jQuery("#" + container + "-loader").fadeOut("fast");
            jQuery("#" + container + "-loader").remove();
            var len = feed.length;
            if (limit !== undefined) {
              if (limit < len) {
                len = limit;
              }
            }
            // determine how to display based on feed type
            switch (type) {
              case "blog":
                jQuery("#" + container).append(
                  "<div id='ocv-feed-entries' class='annotated-list'><input class='search' placeholder='Search' /><ul class='pagination ocv-float-right'></ul><ul id='ocv-feed-entries-list' class='list'></ul><a href='#ocv-feed-entries' class='ocv-float-right'><button id='ocv-top-button' title='Go to top'>Top</button></a></div>"
                );
                for (var i = 0; i < len; i++) {
                  var entry = feed[i];
                  // make sure we have a title
                  if (entry.title == "") {
                    entry.title = "No Title";
                  }
                  var feedItem = container + "-item-" + i;
                  // convert date epoch to human readable
                  var utcSeconds = entry.date.sec;
                  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                  d.setUTCSeconds(utcSeconds);
                  // add container for this entry
                  if (carousel !== undefined) {
                    if (i === 0) {
                      jQuery("#ocv-feed-entries-list").append(
                        "<li><div id='" +
                          feedItem +
                          "' class='ocv-feed-widget-item-container item active'></div></li>"
                      );
                    } else {
                      jQuery("#ocv-feed-entries-list").append(
                        "<li><div id='" +
                          feedItem +
                          "' class='ocv-feed-widget-item-container item'></div></li>"
                      );
                    }
                  } else {
                    jQuery("#ocv-feed-entries-list").append(
                      "<li><div id='" +
                        feedItem +
                        "' class='ocv-feed-widget-item-container'></div></li>"
                    );
                  }
                  if (showDate == true) {
                    jQuery("#" + feedItem).append(
                      "<div class='ocv-feed-widget-item-title'>" +
                        entry.title +
                        "<div class='ocv-feed-widget-item-date'>" +
                        d +
                        "</div></div>"
                    );
                  } else {
                    jQuery("#" + feedItem).append(
                      "<div class='ocv-feed-widget-item-title'>" +
                        entry.title +
                        "<div class='ocv-feed-widget-item-date'> </div></div>"
                    );
                  }
                  jQuery("#" + feedItem).append(
                    "<div class='ocv-feed-widget-item-content'>" +
                      entry.content +
                      "</div>"
                  );
                  // show any images
                  if (entry.images.length > 0) {
                    jQuery("#" + feedItem).append(
                      "<div id='" +
                        feedItem +
                        "-images' class='ocv-feed-widget-item-images'></div>"
                    );
                    for (var j = 0; j < entry.images.length; j++) {
                      jQuery("#" + feedItem + "-images").append(
                        "<div class='ocv-feed-widget-item-image'><a href=\"" +
                          entry.images[j].large +
                          '" data-featherlight=\'image\'><img class="ocv-feed-widget-img-responsive" src="' +
                          entry.images[j].small +
                          '" /></a></div>'
                      );
                    }
                  }
                  //var ocvFeedList = new List('ocv-feed-entries');
                }
                break;
              case "page":
                var entry = feed.data;
                // make sure we have a title
                if (entry.title == "") {
                  entry.title = "No Title";
                }
                var feedItem = container + "-item-";
                // add container for this entry
                if (carousel !== undefined) {
                  if (i === 0) {
                    jQuery("#" + container).append(
                      "<div id='" +
                        feedItem +
                        "' class='ocv-feed-widget-item-container item active'></div>"
                    );
                  } else {
                    jQuery("#" + container).append(
                      "<div id='" +
                        feedItem +
                        "' class='ocv-feed-widget-item-container item'></div>"
                    );
                  }
                } else {
                  jQuery("#" + container).append(
                    "<div id='" +
                      feedItem +
                      "' class='ocv-feed-widget-item-container'></div>"
                  );
                }
                jQuery("#" + feedItem).append(
                  "<div class='ocv-feed-widget-item-title'>" +
                    entry.title +
                    "</div>"
                );
                jQuery("#" + feedItem).append(
                  "<div class='ocv-feed-widget-item-content'>" +
                    entry.content +
                    "</div>"
                );
                // show any images
                if (entry.images.length > 0) {
                  jQuery("#" + feedItem).append(
                    "<div id='" +
                      feedItem +
                      "-images' class='ocv-feed-widget-item-images'></div>"
                  );
                  for (var j = 0; j < entry.images.length; j++) {
                    jQuery("#" + feedItem + "-images").append(
                      "<div class='ocv-feed-widget-item-image'><a href=\"" +
                        entry.images[j].large +
                        '" data-featherlight=\'image\'><img class="ocv-feed-widget-img-responsive" src="' +
                        entry.images[j].small +
                        '" /></a></div>'
                    );
                  }
                }
                break;
              case "alert":
                for (var i = 0; i < len; i++) {
                  var entry = feed[i];
                  var content;
                  var feedItem = container + "-item-" + i;
                  // combine push and description
                  if (entry.push === entry.description) {
                    content = entry.push;
                  } else {
                    content = entry.push + "<br /><br />" + entry.description;
                  }
                  // add container for this entry
                  if (carousel !== undefined) {
                    if (i === 0) {
                      jQuery("#" + container).append(
                        "<div id='" +
                          feedItem +
                          "' class='ocv-feed-widget-item-container item active'></div>"
                      );
                    } else {
                      jQuery("#" + container).append(
                        "<div id='" +
                          feedItem +
                          "' class='ocv-feed-widget-item-container item'></div>"
                      );
                    }
                  } else {
                    jQuery("#" + container).append(
                      "<div id='" +
                        feedItem +
                        "' class='ocv-feed-widget-item-container'></div>"
                    );
                  }
                  jQuery("#" + feedItem).append(
                    "<div class='ocv-feed-widget-item-title'>" +
                      entry.chanTitle +
                      "<div class='ocv-feed-widget-item-date'>" +
                      entry.date +
                      "</div></div>"
                  );
                  jQuery("#" + feedItem).append(
                    "<div class='ocv-feed-widget-item-content'>" +
                      content +
                      "</div>"
                  );
                  // show any images
                  if (entry.images.length > 0) {
                    jQuery("#" + feedItem).append(
                      "<div id='" +
                        feedItem +
                        "-images' class='ocv-feed-widget-item-images'></div>"
                    );
                    for (var j = 0; j < entry.images.length; j++) {
                      jQuery("#" + feedItem + "-images").append(
                        "<div class='ocv-feed-widget-item-image'><a href=\"" +
                          entry.images[j].large +
                          '" data-featherlight=\'image\'><img class="ocv-feed-widget-img-responsive" src="' +
                          entry.images[j].small +
                          '" /></a></div>'
                      );
                    }
                  }
                }
                break;
              case "contacts":
                for (var i = 0; i < len; i++) {
                  var entry = feed[i];
                  var content = "";
                  var feedItem = container + "-item-" + i;
                  // build content based on what parts of the contact entry are there
                  if (entry.email !== undefined) {
                    content += "Email: " + entry.email + "<br />";
                  }
                  if (entry.phone !== undefined) {
                    content += "Phone: " + entry.phone + "<br />";
                  }
                  if (entry.fax !== undefined) {
                    content += "Fax: " + entry.fax + "<br />";
                  }
                  if (entry.address !== undefined) {
                    content += "Address: " + entry.address + "<br />";
                  }
                  if (entry.website !== undefined) {
                    content += "Website: " + entry.website + "<br />";
                  }
                  if (entry.description !== undefined) {
                    content += "Description: " + entry.description + "<br />";
                  }
                  // add container for this entry
                  if (carousel !== undefined) {
                    if (i === 0) {
                      jQuery("#" + container).append(
                        "<div id='" +
                          feedItem +
                          "' class='ocv-feed-widget-item-container item active'></div>"
                      );
                    } else {
                      jQuery("#" + container).append(
                        "<div id='" +
                          feedItem +
                          "' class='ocv-feed-widget-item-container item'></div>"
                      );
                    }
                  } else {
                    jQuery("#" + container).append(
                      "<div id='" +
                        feedItem +
                        "' class='ocv-feed-widget-item-container'></div>"
                    );
                  }
                  jQuery("#" + feedItem).append(
                    "<div class='ocv-feed-widget-item-title'>" +
                      entry.title +
                      "<div class='ocv-feed-widget-item-date'>" +
                      entry.jobtitle +
                      "</div></div>"
                  );
                  jQuery("#" + feedItem).append(
                    "<div class='ocv-feed-widget-item-content'>" +
                      content +
                      "</div>"
                  );
                  // show image
                  if (entry.image !== undefined) {
                    jQuery("#" + feedItem).append(
                      "<div id='" +
                        feedItem +
                        "-images' class='ocv-feed-widget-item-images'></div>"
                    );
                    jQuery("#" + feedItem + "-images").append(
                      "<div class='ocv-feed-widget-item-image'><a href=\"" +
                        entry.image +
                        '" data-featherlight=\'image\'><img class="ocv-feed-widget-img-responsive" src="' +
                        entry.image +
                        '" /></a></div>'
                    );
                  }
                }
                break;
            }
          });
        });
      }
    },
  };
}
