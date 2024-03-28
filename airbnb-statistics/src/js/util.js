
        window.addEventListener('load', function() {
            if (window.location === window.parent.location) {
                const date = new Date();

    			// document.getElementById('infoVersion').innerHTML = '4.1.41';
    			// document.getElementById('infoBuild').innerHTML = `<span class="card-title card-info">Generated using Studio CLI on</span><span class="card-title card-info">${date.toLocaleString()}</span>`;
            }    
                
            $(document).on('click', '.triggerFullViewModal', function (event) {
                const _ = cf.getDependency('lodash');
                const selectedVisualization = cf.getVisualization(event.currentTarget.getAttribute('data-widget'));                
    
                if (!selectedVisualization) return;
                if (selectedVisualization._chartType === 'Geo Map GL' && selectedVisualization.get('visual')._fullScreenControl) {
                    selectedVisualization.get('visual')._fullScreenControl._onClickFullscreen();
                } else {
                    $('body').css('overflow', 'hidden');
                    $('#fullView').show();
                    $('#fullViewTitle').html(_.escape(event.currentTarget.getAttribute('data-title')));
                    const fullViewVisualization = selectedVisualization.duplicate();

                    fullViewVisualization.element('fullViewBody');
                    fullViewVisualization.on('execute:start', function () {
                        $('.loader-fullview').show();
                    });
                    fullViewVisualization.on('execute:stop', function () {
                        $('.loader-fullview').hide();
                    });
                    fullViewVisualization.off('click');
                    fullViewVisualization.execute(Boolean(fullViewVisualization.get('nonQuery')));
                }
            });
    
            $('#closeFullViewModal').on('click', function () {
                $('#fullView').hide();
                cf.getVisualization('fullViewBody').remove();
                $('body').css('overflow', 'auto');
            });
    
            $('.grid-stack-item').on('mouseenter', e => {
                $(e.currentTarget).find('.fullViewIcon').show();
            });
    
            $('.grid-stack-item').on('mouseleave', e => {
                $(e.currentTarget).find('.fullViewIcon').hide();
            });    
            
        			$('#chartFactorLogo').on('click', function() {
            			const infoContainer = $('#studioInfo');
            			const toggleDisplay = infoContainer.css('display') === 'none' ? 'block' : 'none';
            
            			infoContainer.css('display', toggleDisplay);
        			});
        });
