var BRIGHTFACE = BRIGHTFACE || {};

BRIGHTFACE.bookr = BRIGHTFACE.bookr || ( function () {
  var drawChart = function (data) {
        var $chartContainer = $('.chart-container'),
            $chart = $chartContainer.find('canvas'),
            ctx = $chart.get(0).getContext('2d'),
            //see full list of options at http://www.chartjs.org/docs/#lineChart-chartOptions
            options = {
              'scaleOverlay': true,
              'scaleOverride': true,
              'scaleSteps': 4,
              'scaleStepWidth': 25,
              'scaleStartValue': 0,
              'scaleLineColor': 'rgba(0, 0, 0, 0.3)',
              'scaleFontFamily': 'Montserrat',
              'scaleFontColor': '#808080',
              'scaleShowGridLines': true,
              'scaleGridLineColor': 'rgba(0, 0, 0, 0.06)',
              'pointDot': false,
              'animationSteps': 75,
              'animationEasing': 'easeInOutQuart'
            };

        $chart.attr( 'width', $chartContainer.width() - 70 );
        $chart.attr( 'height', ( $chartContainer.width() - 70 ) / 2 );

        new Chart(ctx).Line(data, options);
      },
      getChartData = function (property, month, year) {
        $.ajax( {
          dataType: 'json',
          url: '[CHART_ENDPOINT_URL]',
          data: {
            'property': property,
            'month': month,
            'year': year
          },
          success: function (data, status) {
            drawChart(data);
          },
          error: function (data, status) {
            console.debug(data);
            console.debug(status);
            //TODO: this hardcoded call needs to be removed!
            drawChart( {
              'labels': [ '1', '', '', '', '5', '', '', '', '10', '', '', '', '15', '', '', '', '20', '', '', '', '25', '', '', '', '30' ],
              'datasets': [
                {
                  'fillColor': 'rgba(63, 169, 245, 0.1)',
                  'strokeColor': 'rgba(63, 169, 245, 1)',
                  'data': [ 50, 57, 43, 30, 29, 66, 70, 86, 62, 55, 42, 43, 19, 26, 35, 77, 80, 89, 95, 80, 69, 72, 75, 88, 74, 72, 53, 45, 65, 60, 62 ]
                }
              ]
            } );
          }
        } );
      },
      updateChart = function () {
        var property = $('#propertyDropdown').val(),
            month = $('#monthDropdown').val(),
            year = $('#yearDropdown').val();

        if ( property && month && year ) {
          $('.x-axis').html( month + ' ' + year );
          getChartData(property, month, year);
        }
      },
      addLine = function (event) {
        var $addLink = $(this),
            $list = $addLink.closest('.list-panel').find('tbody'),
            $newRow = $list.find('.list-item').eq(0).clone().removeClass('hide');

        $addLink.closest('tr').before($newRow);
        $newRow.find('.remove-list-item').on( 'click', removeLine );
        event.preventDefault();
      },
      removeLine = function (event) {
        $(this).closest('.list-item').remove();
        event.preventDefault();
      },
      selectRoom = function () {
        var $roomButton = $(this),
            $otherRoomButtons;

        if ( !$roomButton.hasClass('active') ) {
          $roomButton.closest('.room-buttons').find('.room-button').not($roomButton).removeClass('active');
          $roomButton.addClass('active');
        }
      };

  return {
    'updateChart': updateChart,
    'addLine': addLine,
    'selectRoom': selectRoom
  };
}());


$(document).ready( function () {
  if ( $('.chart-container').length ) {
    $('#propertyDropdown, #monthDropdown, #yearDropdown').on( 'change', BRIGHTFACE.bookr.updateChart );
    BRIGHTFACE.bookr.updateChart();
  }
  if ( $('.list-panel').length ) {
    $('.add-list-item').on( 'click', BRIGHTFACE.bookr.addLine );
  }
  if ( $('.room-buttons').length ) {
    $('.room-button').on( 'click', BRIGHTFACE.bookr.selectRoom );
  }
});

