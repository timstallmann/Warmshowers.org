/**
 * Map add-ons (Adventure Cycling routes, Expand/collapse, etc.)
 *
 * @param context
 */
(function ($) {

  Drupal.behaviors.mapBehaviors = {
    attach: function (context, settings) {
      // Grab css vars upon page load to reuse
      var originalMapHeight = $('#wsmap_map').height();
      var originalMapBlockHeight = $('div.block-wsmap').height();
      var originalSectionTop = $("body.with-highlight #navigation .section").css('top');
      if (originalSectionTop != null) {
        var shrunkenSectionTop = Number(originalSectionTop.substr(0, originalSectionTop.length - 2) + 191) + "px";
      }

      $("#expand_map").click(function () {
        $(".region-sidebar-first .section").hide(1000);
        $(".region-highlight").hide(1000);
        $("body.with-highlight #navigation .section").hide(1000);
        $(".sidebar-first #content").animate({
          marginLeft: "0px",
          width: "100%"
        }, 1000, function () {
          $("#collapse_map").show().css("display", "block");
          $("body.with-highlight #navigation .section").css("top", shrunkenSectionTop);
          $("body.with-highlight #navigation .section").show("fast");
        });
        // If the window can handle, let's expand the height too
        if ($(window).height() - 150 > $('#wsmap_map').height()) {
          $("#wsmap_map").animate({
            'height': $(window).height() - 150 + 'px'
          }, 1000);

          $("#content .block-wsmap").animate({
            'height': $(window).height() - 130 + 'px'
          }, 1000);

        }

        return false;
      });

      $("#collapse_map").click(function () {
        $("body.with-highlight #navigation .section").hide(1000);
        $(".region-sidebar-first .section").show(1000);
        $(".region-highlight").show(1000);
        $(".sidebar-first #content").animate({
          marginLeft: '240px',
          width: '720px'
        }, 1000, function () {
          $("#expand_map").show();
          $("#collapse_map").hide();
          $("body.with-highlight #navigation .section").css("top", originalSectionTop);
          $("body.with-highlight #navigation .section").show("fast");
        });

        // If the height was expanded on expansion, let's collapse to original height
        if ($('#wsmap_map').height() > originalMapHeight) {
          $("#wsmap_map").animate({
            'height': originalMapHeight + 'px'
          }, 1000);
          $("#content .block-wsmap").animate({
            'height': originalMapBlockHeight + 'px'
          }, 1000);

        }

        return false;
      });

      // Toogle checkbox for showing/hiding Adventure Cycling KML
      $('#adv_cyc_checkbox').click(function () {
        if ($(this).is(':checked')) {
          loadAdvCycling(Drupal.settings.wsmap.advCycKML)
        } else {
          unloadAdvCycling();
        }
      });

      // Toggle opacity of markers
      $('#hide_markers_checkbox').click(function () {
        if ($(this).is(':checked')) {
          marker_base_opacity = Drupal.settings.wsmap.marker_base_opacity * Drupal.settings.wsmap.marker_dimming_factor;
          marker_combined_opacity = Drupal.settings.wsmap.marker_combined_opacity * Drupal.settings.wsmap.marker_dimming_factor;
          ;
        } else {
          marker_base_opacity = Drupal.settings.wsmap.marker_base_opacity;
          marker_combined_opacity = Drupal.settings.wsmap.marker_combined_opacity;
        }
        // Force redraw
        marker_refresh_required = true;
        google.maps.event.trigger(map, 'idle');
      })
    }
  }

})(jQuery)
