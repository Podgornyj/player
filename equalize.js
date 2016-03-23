 window.AudioContext = window.AudioContext || window.webkitAudioContext;
            var context = new AudioContext(),
                audio = document.querySelector('audio');
            var myFilters;

            var createFilter = function(frequency) {
                var filter = context.createBiquadFilter();

                filter.type = 'peaking'; 
                filter.frequency.value = frequency; 
                filter.Q.value = 1; 
                filter.gain.value = 0;

                return filter;
            };

            var createFilters = function() {
                var frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000],
                    filters = frequencies.map(createFilter);

                filters.reduce(function(prev, curr) {
                    prev.connect(curr);
                    return curr;
                });

                return filters;
            };

            var equalize = function(audio) {
                var source = context.createMediaElementSource(audio),
                    filters = createFilters();
                var node = context.createScriptProcessor(2048, 1, 1);
                var analyser = context.createAnalyser();
                analyser.smoothingTimeConstant = 0.3;
                analyser.fftSize = 512;
                var bands = new Uint8Array(analyser.frequencyBinCount);
                //source.connect(analyser)
                //analyser.connect(node)
                //node.connect(context.destination)
                //source.connect(context.destination)
                //var gr = document.querySelectorAll('.grafika progress')

                var example = document.querySelector('canvas'),
                    ctx = example.getContext('2d');

                node.onaudioprocess = function() {
                    if (!audio.paused) {
                        analyser.getByteFrequencyData(bands)
                            //console.log(bands)  
                        var gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        //gradient.addColorStop(0, '#000000');
                        gradient.addColorStop(0.8, '#7551FC');
                        gradient.addColorStop(0.125, '#FB0410');
                        //gradient.addColorStop(0, '#ffffff');
                        ctx.clearRect(0, 0, 500, 256);
                        ctx.fillStyle = gradient;
                        //drawSpectrum(bands);

                        
                            for (var i = 0; i < (bands.length); i++) {
                                var value = bands[i];
                                ctx.fillRect(i * 5, 256 - value, 4, 256);

                            }
                        
                        
                    }
                }
                
                source.connect(filters[0]);               
                filters[filters.length - 1].connect(analyser);
                analyser.connect(node)
                node.connect(context.destination)
                filters[filters.length - 1].connect(context.destination)
                myFilters = filters
            };

            var myInputs = document.querySelectorAll('.equalizeControls input')
            initEvents = function(inputs) {
                [].forEach.call(inputs, function(item, i) {
                    item.addEventListener('change', function(e) {
                        myFilters[i].gain.value = e.target.value;
                    }, false);
                });
            }

            initEvents(myInputs)

            equalize(audio);