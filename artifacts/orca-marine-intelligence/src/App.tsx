import { type FormEvent, type ReactNode, createContext, useContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Anchor, ArrowRight, Bell, Bot, Check, CircleHelp, CloudLightning, Compass, Database, Fish, Gauge, Globe2, Info, Layers3, Map as MapIcon, Menu, MessageCircle, Navigation, PanelTop, RefreshCw, Route as RouteIcon, Send, ShieldCheck, Ship, Thermometer, Waves, Wind, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type Freshness = 'LIVE' | 'CACHED' | 'STALE' | 'UNAVAILABLE';
type AlertSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

type Language = 'English' | 'हिन्दी' | 'తెలుగు';

const translations = {
  English: {
    navOverview: 'Overview', navAssistant: 'Ask ORCA', navMap: 'Ocean map', navAlerts: 'Alerts', navRoute: 'Route planner', navAbout: 'About ORCA', home: 'Home', map: 'Map', route: 'Route', about: 'About',
    companion: 'Your sea companion', demoMode: 'Demo data mode', localPreview: 'Local preview fixtures only.', noLive: 'No live decision is being made.',
    coastalKarnataka: 'Coastal Karnataka', updated: 'Updated', refresh: 'Refresh preview data', ready: 'Ready', malpeLoaded: 'Malpe context loaded', agentsReady: 'Agents ready', demoContext: 'Demo context', localFixtures: 'Local fixtures',
    previewWorkspace: 'Preview workspace', demoNotice: 'Readings and verdicts below are realistic local demo fixtures, not live safety guidance.',
    morningBrief: 'Morning brief · Tuesday, 18 June 2024', goodMorning: 'Good morning, Ravi.', seaBeforeLeave: 'Here is what the sea is telling you before you leave Malpe harbour.', askOrca: 'Ask ORCA', planTrip: 'Plan a trip',
    departureVerdict: 'Departure safety verdict', canGoFishing: 'Can I go fishing today?', go: 'GO', caution: 'CAUTION', noGo: 'NO-GO', suitableNearshore: 'Conditions are suitable for a nearshore trip from Malpe. Leave before 06:00 and return by 16:00 as winds strengthen offshore. Keep the radio watch active.',
    confidence: 'Confidence', evidenceCurrent: 'Evidence current', validSixHours: 'Valid for 6 hours', rightNow: 'Right now', coastalConditions: 'Coastal conditions', waveHeight: 'Wave height', wind: 'Wind', swell: 'Swell', visibility: 'Visibility', seaTemp: 'Sea temp', chlorophyll: 'Chlorophyll', calm: 'Calm', steady: 'steady', southWest: 'South-west', clear: 'Clear', normal: 'Normal', goodPfz: 'Good PFZ signal', live: 'Live', cached: 'Cached', stale: 'Stale', unavailable: 'Unavailable', hours: 'hours', routeTo: 'to',
    signals: 'Signals to keep in mind', onlyChanges: 'Only the things that could change your plan.', viewAll: 'View all', waterAtGlance: 'Your water, at a glance', pfzActivity: 'PFZ and vessel activity around Malpe.', openMap: 'Open map', selectedPfz: 'Selected PFZ 04', yourVessel: 'Your vessel', howReached: 'How ORCA reached this answer', fiveAgents: 'Five specialist agents checked the same departure window.', seeReasoning: 'See reasoning',
    marineAssistant: 'Marine intelligence assistant', clearerQuestion: 'Ask the sea a clearer question.', evidenceTogether: 'ORCA brings weather, ocean, satellite and map evidence together — then shows its work.', orcaIntelligence: 'ORCA intelligence', underAnswer: 'Under the answer', agentReasoning: 'Agent reasoning', collaborativeTrace: 'A collaborative trace, in plain language.', verdictSigned: 'Verdict signed by risk agent',
    firstMessage: 'Good morning. I have checked the sea around Malpe for your usual nearshore trip. Ask me anything, or use one of the questions below.', secondMessage: 'The short answer is GO until 16:00. Winds build after that, and a lightning cell is moving north-east 42 km offshore.', checking: 'Checking the latest context…', you: 'You', send: 'Send', askPlaceholder: 'Ask about your trip, conditions or a place…', suggestionPfz: 'Can I go to PFZ 04?', suggestionWhy: 'Why is the answer GO?', suggestionWatch: 'What should I watch for?', suggestionReturn: 'Plan a safe return',
    geospatial: 'Geospatial workspace', waterAround: 'See the water around you.', mapDescription: 'A simple operational view for zones, vessels and boundaries near Malpe.', allLayers: 'All layers', pfzZones: 'PFZ zones', vessels: 'Vessels', mapCache: 'Map cache · 09:31', worldIndia: 'World view · India focus', globalContext: 'Global context', malpeHarbour: 'Malpe harbour', arabianSea: 'Arabian sea', regulatedBoundary: 'Regulated boundary', selectedArea: 'Selected area · India west coast', fishingSignal: 'Fishing signal', fromMalpe: 'from Malpe harbour.', latestPreview: 'in the latest local preview.', satelliteSignal: 'Satellite signal', details: 'Details', nearbyZones: 'Nearby fishing zones', mapLayers: 'Map layers', nearbyVessels: 'Nearby vessels', vesselActivity: 'Vessel activity', nearby: 'nearby', lastPosition: 'Last position received 18 min ago. Your vessel is shown in navy.', aisPositions: 'AIS positions · 18 min', searchPlace: 'Search harbour / beach / village', layersOsm: 'Layers: OSM', fetchHere: 'Fetch here', fishHotspots: 'Fish hotspots', zoomIn: 'Zoom in', zoomOut: 'Zoom out',
    alertsTitle: 'Alerts worth your attention.', alertsEyebrow: 'Proactive watch', alertsDescription: 'Signals are ordered by what could change a safe departure today.', monitoring: 'Monitoring 4 signals', allAlerts: 'All alerts', highPriority: 'High priority', mediumPriority: 'Medium priority', lowPriority: 'Low priority', showing: 'showing', nothingElse: 'Nothing else needs your attention.', alertGuidance: 'Alert guidance', readSignal: 'Read the signal, not just the colour.', alertGuidanceCopy: 'A red alert is not automatically a no-go. ORCA weighs where it is, when it will arrive and whether your route intersects it.', newlyObserved: 'newly observed', availableOffline: 'available offline', useCaution: 'use with caution',
    routeEyebrow: 'Trip planning', routeTitle: 'Know the route before you cast off.', routeDescription: 'Compare departure time, destination and conditions in one calm view.', riskReady: 'Risk engine ready', buildTrip: 'Build a trip', heading: 'Where are you heading?', departurePoint: 'Departure point', destinationZone: 'Destination or fishing zone', leaveAt: 'Leave at', duration: 'Trip duration', checkSafety: 'Check route safety', routeResult: 'Route safety result', routeSuitable: 'Your route from', suitableIf: 'is suitable if you leave at', returnBefore: 'Return before 16:00 as winds build offshore.', nauticalMiles: 'nautical miles', peakWave: 'peak wave', returnBy: 'return by', whyRoute: 'Why this route works', clearWindow: 'Clear departure window', clearWindowCopy: 'The first 4 hours remain below the caution threshold for wind and wave height.', boundaryChecked: 'Boundary distance checked', boundaryCopy: 'The route keeps 3.8 nautical miles from the seasonal regulated boundary.', enterTrip: 'Enter your trip details to see a route safety answer.', sameEvidence: 'ORCA will check the same evidence as your overview.',
    fieldGuide: 'The ORCA field guide', clarity: 'Clarity at the water’s edge.', fieldGuideCopy: 'The short version of how ORCA helps you make a safer call.', plainLanguage: 'Plain language first', orcaAnswers: 'ORCA answers “Can I go?”', plainLanguageCopy: 'ORCA turns many separate signals — weather, waves, ocean colour, satellite nowcasts and mapped boundaries — into one clear operational answer. You see the verdict, the time window and the reasons behind it.', verdicts: 'Verdicts', signedOutputs: 'GO, CAUTION or NO-GO are signed outputs.', verdictCopy: 'The safety verdict is produced by the risk service after specialist agents compare evidence. The app does not calculate a verdict in your browser. Every answer has a place, a validity window and a confidence level.', goSuitable: 'GO · suitable', cautionPlan: 'CAUTION · plan carefully', noGoStay: 'NO-GO · stay ashore', signalDrops: 'When signal drops', offline: 'Useful offline, honest about limits.', offlineCopy: 'The latest trusted verdict and a compact set of safety signals can remain available when you lose coverage. ORCA clearly labels each piece of evidence as LIVE, CACHED, STALE or UNAVAILABLE. It never makes stale data look current.', evidenceBrief: 'Evidence in the brief', aiRole: 'The role of AI', aiRoleTitle: 'Helpful like a trusted colleague.', aiRoleCopy: 'AI is used to coordinate specialist checks and explain their result. It does not invent observations or replace an official warning. When evidence conflicts, ORCA says so and takes the safer path.', officialNote: 'Always use official local instructions and your own seamanship alongside ORCA.', madeCoast: 'Made for the coast', smallScreen: 'Small screen. Big consequence.', smallScreenCopy: 'Built for fishermen, coastal authorities and maritime operators who need the useful answer quickly — in English, हिन्दी or తెలుగు, with a clear explanation when there is time to ask why.',
    weatherLightning: 'Weather and lightning', oceanConditions: 'Ocean conditions', satellitePfz: 'Satellite and PFZ', boundariesNotices: 'Boundaries and notices', imdInsat: 'IMD coastal forecast · INSAT-3D', buoyWave: 'Buoy observations · wave model', oceanColour: 'Ocean colour · chlorophyll signal', coastalAuthority: 'Coastal authority datasets',
    planner: 'Planner agent', plannerNote: 'Framed the question for a 06:00–16:00 trip', weatherAgent: 'Weather agent', weatherNote: 'Wind and lightning cell checked against coastal forecast', oceanAgent: 'Ocean agent', oceanNote: 'Wave, swell and visibility combined', geoAgent: 'Geospatial agent', geoNote: 'PFZ 04 and boundary distance verified', riskAgent: 'Risk agent', riskNote: 'Issued a GO with a return-before window',
    alertWindTitle: 'Strong winds building offshore', alertWindBody: 'Wind may reach 28 km/h after 16:00. Keep the return leg close to shore.', alertLightningTitle: 'Lightning cell 42 km south-east', alertLightningBody: 'A fast-moving cell is tracking north-east. ORCA recommends returning before 15:30.', alertBoundaryTitle: 'Seasonal boundary ahead of PFZ 04', alertBoundaryBody: 'The selected zone sits 3.8 nautical miles from a regulated fishing boundary.', alertVisibilityTitle: 'Visibility is clear near shore', alertVisibilityBody: 'Visibility is 8.4 km at the departure point and remains suitable for navigation.', coastalForecast: 'IMD coastal forecast', insat: 'INSAT-3D nowcast', authorityNotice: 'Coastal authority notice', buoy: 'Buoy KA-07',
    moderateSignal: 'Moderate signal', strongSignal: 'Strong signal', freshObservation: 'Fresh observation', issuedGo: 'Issued a GO with a return-before window',
  },
  'हिन्दी': {
    navOverview: 'अवलोकन', navAssistant: 'ORCA से पूछें', navMap: 'समुद्री मानचित्र', navAlerts: 'अलर्ट', navRoute: 'मार्ग योजना', navAbout: 'ORCA के बारे में', home: 'होम', map: 'मानचित्र', route: 'मार्ग', about: 'जानकारी',
    companion: 'आपका समुद्री साथी', demoMode: 'डेमो डेटा मोड', localPreview: 'केवल स्थानीय प्रीव्यू डेटा।', noLive: 'कोई लाइव निर्णय नहीं लिया जा रहा है।',
    coastalKarnataka: 'तटीय कर्नाटक', updated: 'अपडेट', refresh: 'प्रीव्यू डेटा रीफ्रेश करें', ready: 'तैयार', malpeLoaded: 'मालपे संदर्भ लोड है', agentsReady: 'एजेंट तैयार हैं', demoContext: 'डेमो संदर्भ', localFixtures: 'स्थानीय डेटा',
    previewWorkspace: 'प्रीव्यू वर्कस्पेस', demoNotice: 'नीचे दिए गए रीडिंग और निर्णय वास्तविक स्थानीय डेमो डेटा हैं, लाइव सुरक्षा सलाह नहीं।',
    morningBrief: 'सुबह की जानकारी · मंगलवार, 18 जून 2024', goodMorning: 'सुप्रभात, रवि।', seaBeforeLeave: 'मालपे बंदरगाह से निकलने से पहले समुद्र की स्थिति यह है।', askOrca: 'ORCA से पूछें', planTrip: 'यात्रा योजना',
    departureVerdict: 'प्रस्थान सुरक्षा निर्णय', canGoFishing: 'क्या आज मछली पकड़ने जा सकता हूँ?', go: 'जाएँ', caution: 'सावधानी', noGo: 'न जाएँ', suitableNearshore: 'मालपे से तट के पास यात्रा के लिए स्थितियाँ उपयुक्त हैं। 06:00 से पहले निकलें और 16:00 तक लौटें क्योंकि समुद्र में हवा तेज होगी। रेडियो वॉच सक्रिय रखें।',
    confidence: 'विश्वास', evidenceCurrent: 'सबूत वर्तमान', validSixHours: '6 घंटे तक मान्य', rightNow: 'अभी', coastalConditions: 'तटीय स्थितियाँ', waveHeight: 'लहर ऊँचाई', wind: 'हवा', swell: 'स्वेल', visibility: 'दृश्यता', seaTemp: 'समुद्र तापमान', chlorophyll: 'क्लोरोफिल', calm: 'शांत', steady: 'स्थिर', southWest: 'दक्षिण-पश्चिम', clear: 'साफ', normal: 'सामान्य', goodPfz: 'अच्छा PFZ संकेत', live: 'लाइव', cached: 'कैश्ड', stale: 'पुराना', unavailable: 'उपलब्ध नहीं', hours: 'घंटे', routeTo: 'तक',
    signals: 'ध्यान रखने योग्य संकेत', onlyChanges: 'सिर्फ वे बातें जो आपकी योजना बदल सकती हैं।', viewAll: 'सभी देखें', waterAtGlance: 'आपके आसपास का पानी', pfzActivity: 'मालपे के आसपास PFZ और नावों की गतिविधि।', openMap: 'मानचित्र खोलें', selectedPfz: 'चयनित PFZ 04', yourVessel: 'आपकी नाव', howReached: 'ORCA इस उत्तर तक कैसे पहुँचा', fiveAgents: 'पाँच विशेषज्ञ एजेंटों ने एक ही प्रस्थान समय की जाँच की।', seeReasoning: 'तर्क देखें',
    marineAssistant: 'समुद्री इंटेलिजेंस सहायक', clearerQuestion: 'समुद्र से स्पष्ट सवाल पूछें।', evidenceTogether: 'ORCA मौसम, समुद्र, सैटेलाइट और मानचित्र के सबूत साथ लाता है — और अपनी प्रक्रिया दिखाता है।', orcaIntelligence: 'ORCA इंटेलिजेंस', underAnswer: 'उत्तर के पीछे', agentReasoning: 'एजेंट का तर्क', collaborativeTrace: 'सरल भाषा में सहयोगी प्रक्रिया।', verdictSigned: 'जोखिम एजेंट द्वारा सत्यापित निर्णय',
    firstMessage: 'सुप्रभात। मैंने आपकी सामान्य तट के पास की यात्रा के लिए मालपे के आसपास समुद्र जाँचा है। कुछ भी पूछें या नीचे दिए सवालों में से चुनें।', secondMessage: 'छोटा उत्तर है: 16:00 तक जाएँ। उसके बाद हवा तेज होगी और 42 किमी दूर समुद्र में बिजली का सेल उत्तर-पूर्व की ओर बढ़ रहा है।', checking: 'नया संदर्भ जाँचा जा रहा है…', you: 'आप', send: 'भेजें', askPlaceholder: 'अपनी यात्रा, स्थितियों या जगह के बारे में पूछें…', suggestionPfz: 'क्या PFZ 04 जा सकता हूँ?', suggestionWhy: 'उत्तर जाएँ क्यों है?', suggestionWatch: 'किस बात पर ध्यान दूँ?', suggestionReturn: 'सुरक्षित वापसी योजना',
    geospatial: 'भौगोलिक वर्कस्पेस', waterAround: 'अपने आसपास का पानी देखें।', mapDescription: 'मालपे के पास ज़ोन, नावों और सीमाओं के लिए सरल संचालन दृश्य।', allLayers: 'सभी लेयर', pfzZones: 'PFZ ज़ोन', vessels: 'नावें', mapCache: 'मानचित्र कैश · 09:31', worldIndia: 'विश्व दृश्य · भारत केंद्रित', globalContext: 'वैश्विक संदर्भ', malpeHarbour: 'मालपे बंदरगाह', arabianSea: 'अरब सागर', regulatedBoundary: 'नियंत्रित सीमा', selectedArea: 'चयनित क्षेत्र · भारत पश्चिमी तट', fishingSignal: 'मछली संकेत', fromMalpe: 'मालपे बंदरगाह से', latestPreview: 'नवीनतम स्थानीय प्रीव्यू में', satelliteSignal: 'सैटेलाइट संकेत', details: 'विवरण', nearbyZones: 'पास के मछली क्षेत्र', mapLayers: 'मानचित्र लेयर', nearbyVessels: 'पास की नावें', vesselActivity: 'नाव गतिविधि', nearby: 'पास में', lastPosition: 'अंतिम स्थिति 18 मिनट पहले मिली। आपकी नाव नेवी में दिखाई गई है।', aisPositions: 'AIS स्थिति · 18 मिनट', searchPlace: 'बंदरगाह / समुद्र तट / गाँव खोजें', layersOsm: 'लेयर: OSM', fetchHere: 'यहाँ डेटा लें', fishHotspots: 'मछली हॉटस्पॉट', zoomIn: 'ज़ूम इन', zoomOut: 'ज़ूम आउट',
    alertsTitle: 'ध्यान देने योग्य अलर्ट।', alertsEyebrow: 'सक्रिय निगरानी', alertsDescription: 'संकेत इस आधार पर क्रम में हैं कि आज सुरक्षित प्रस्थान पर क्या असर पड़ सकता है।', monitoring: '4 संकेतों की निगरानी', allAlerts: 'सभी अलर्ट', highPriority: 'उच्च प्राथमिकता', mediumPriority: 'मध्यम प्राथमिकता', lowPriority: 'कम प्राथमिकता', showing: 'दिखाए जा रहे', nothingElse: 'अब किसी और बात पर ध्यान देने की जरूरत नहीं।', alertGuidance: 'अलर्ट मार्गदर्शन', readSignal: 'सिर्फ रंग नहीं, संकेत पढ़ें।', alertGuidanceCopy: 'लाल अलर्ट अपने आप नो-गो नहीं होता। ORCA देखता है कि वह कहाँ है, कब पहुँचेगा और क्या आपका मार्ग उससे टकराता है।', newlyObserved: 'अभी देखा गया', availableOffline: 'ऑफलाइन उपलब्ध', useCaution: 'सावधानी से उपयोग करें',
    routeEyebrow: 'यात्रा योजना', routeTitle: 'निकलने से पहले मार्ग जानें।', routeDescription: 'प्रस्थान समय, गंतव्य और स्थितियों की एक साथ तुलना करें।', riskReady: 'जोखिम इंजन तैयार', buildTrip: 'यात्रा बनाएँ', heading: 'आप कहाँ जा रहे हैं?', departurePoint: 'प्रस्थान स्थान', destinationZone: 'गंतव्य या मछली क्षेत्र', leaveAt: 'निकलने का समय', duration: 'यात्रा अवधि', checkSafety: 'मार्ग सुरक्षा जाँचें', routeResult: 'मार्ग सुरक्षा परिणाम', routeSuitable: 'आपका मार्ग', suitableIf: 'उपयुक्त है यदि आप', returnBefore: 'समुद्र में हवा तेज होने से पहले 16:00 तक लौटें।', nauticalMiles: 'नॉटिकल मील', peakWave: 'अधिकतम लहर', returnBy: 'वापसी समय', whyRoute: 'यह मार्ग क्यों ठीक है', clearWindow: 'साफ प्रस्थान समय', clearWindowCopy: 'पहले 4 घंटे हवा और लहर की सावधानी सीमा से नीचे रहते हैं।', boundaryChecked: 'सीमा की दूरी जाँची गई', boundaryCopy: 'मार्ग मौसमी नियंत्रित सीमा से 3.8 नॉटिकल मील दूर रहता है।', enterTrip: 'मार्ग सुरक्षा उत्तर देखने के लिए यात्रा विवरण भरें।', sameEvidence: 'ORCA आपके अवलोकन के समान सबूत जाँचेगा।',
    fieldGuide: 'ORCA फील्ड गाइड', clarity: 'समुद्र के किनारे स्पष्टता।', fieldGuideCopy: 'ORCA आपको सुरक्षित निर्णय लेने में कैसे मदद करता है, उसका संक्षिप्त परिचय।', plainLanguage: 'पहले सरल भाषा', orcaAnswers: 'ORCA पूछता है “क्या मैं जा सकता हूँ?”', plainLanguageCopy: 'ORCA मौसम, लहरों, समुद्र के रंग, सैटेलाइट और मानचित्र सीमाओं जैसे संकेतों को एक स्पष्ट संचालन उत्तर में बदलता है। आपको निर्णय, समय और कारण दिखते हैं।', verdicts: 'निर्णय', signedOutputs: 'जाएँ, सावधानी या न जाएँ — ये सत्यापित परिणाम हैं।', verdictCopy: 'विशेषज्ञ एजेंटों द्वारा सबूतों की तुलना के बाद जोखिम सेवा सुरक्षा निर्णय देती है। ऐप ब्राउज़र में निर्णय नहीं निकालता। हर उत्तर में स्थान, समय सीमा और विश्वास स्तर होता है।', goSuitable: 'जाएँ · उपयुक्त', cautionPlan: 'सावधानी · योजना बनाएँ', noGoStay: 'न जाएँ · किनारे रहें', signalDrops: 'जब संकेत कमजोर हो', offline: 'ऑफलाइन उपयोगी, सीमाओं के बारे में ईमानदार।', offlineCopy: 'कवरेज खोने पर नवीनतम भरोसेमंद निर्णय और सुरक्षा संकेत उपलब्ध रह सकते हैं। ORCA हर सबूत को LIVE, CACHED, STALE या UNAVAILABLE के रूप में दिखाता है।', evidenceBrief: 'रिपोर्ट के सबूत', aiRole: 'AI की भूमिका', aiRoleTitle: 'भरोसेमंद सहकर्मी जैसा सहायक।', aiRoleCopy: 'AI विशेषज्ञ जाँचों को साथ लाने और परिणाम समझाने में मदद करता है। यह निरीक्षण नहीं गढ़ता और आधिकारिक चेतावनी की जगह नहीं लेता।', officialNote: 'ORCA के साथ हमेशा स्थानीय आधिकारिक निर्देश और अपनी नाव चलाने की समझ का उपयोग करें।', madeCoast: 'तट के लिए बनाया गया', smallScreen: 'छोटी स्क्रीन। बड़ा असर।', smallScreenCopy: 'मछुआरों, तटीय अधिकारियों और समुद्री ऑपरेटरों के लिए बनाया गया — English, हिन्दी या తెలుగు में तुरंत उपयोगी उत्तर।',
    weatherLightning: 'मौसम और बिजली', oceanConditions: 'समुद्री स्थितियाँ', satellitePfz: 'सैटेलाइट और PFZ', boundariesNotices: 'सीमाएँ और सूचनाएँ', imdInsat: 'IMD तटीय पूर्वानुमान · INSAT-3D', buoyWave: 'बॉय अवलोकन · लहर मॉडल', oceanColour: 'समुद्र रंग · क्लोरोफिल संकेत', coastalAuthority: 'तटीय प्राधिकरण डेटा',
    planner: 'प्लानर एजेंट', plannerNote: '06:00–16:00 यात्रा के लिए सवाल तैयार किया', weatherAgent: 'मौसम एजेंट', weatherNote: 'हवा और बिजली के सेल को तटीय पूर्वानुमान से जाँचा', oceanAgent: 'समुद्र एजेंट', oceanNote: 'लहर, स्वेल और दृश्यता को जोड़ा', geoAgent: 'भौगोलिक एजेंट', geoNote: 'PFZ 04 और सीमा की दूरी सत्यापित की', riskAgent: 'जोखिम एजेंट', riskNote: 'वापसी समय के साथ जाएँ निर्णय दिया',
    alertWindTitle: 'समुद्र में तेज हवा बढ़ रही है', alertWindBody: '16:00 के बाद हवा 28 किमी/घंटा तक पहुँच सकती है। वापसी का मार्ग तट के पास रखें।', alertLightningTitle: 'दक्षिण-पूर्व में 42 किमी दूर बिजली का सेल', alertLightningBody: 'तेज़ सेल उत्तर-पूर्व की ओर बढ़ रहा है। ORCA 15:30 से पहले लौटने की सलाह देता है।', alertBoundaryTitle: 'PFZ 04 के आगे मौसमी सीमा', alertBoundaryBody: 'चयनित क्षेत्र नियंत्रित मछली सीमा से 3.8 नॉटिकल मील दूर है।', alertVisibilityTitle: 'तट के पास दृश्यता साफ है', alertVisibilityBody: 'प्रस्थान स्थान पर दृश्यता 8.4 किमी है और नाव चलाने के लिए उपयुक्त है।', coastalForecast: 'IMD तटीय पूर्वानुमान', insat: 'INSAT-3D नाउकास्ट', authorityNotice: 'तटीय प्राधिकरण सूचना', buoy: 'बॉय KA-07',
    moderateSignal: 'मध्यम संकेत', strongSignal: 'मजबूत संकेत', freshObservation: 'नया अवलोकन', issuedGo: 'वापसी समय के साथ जाएँ निर्णय दिया',
  },
  'తెలుగు': {
    navOverview: 'అవలోకనం', navAssistant: 'ORCAని అడగండి', navMap: 'సముద్ర పటం', navAlerts: 'అలర్ట్లు', navRoute: 'మార్గ ప్రణాళిక', navAbout: 'ORCA గురించి', home: 'హోమ్', map: 'పటం', route: 'మార్గం', about: 'సమాచారం',
    companion: 'మీ సముద్ర సహచరి', demoMode: 'డెమో డేటా మోడ్', localPreview: 'స్థానిక ప్రివ్యూ డేటా మాత్రమే.', noLive: 'లైవ్ నిర్ణయం తీసుకోబడటం లేదు.',
    coastalKarnataka: 'తీర కర్ణాటక', updated: 'నవీకరణ', refresh: 'ప్రివ్యూ డేటాను రిఫ్రెష్ చేయండి', ready: 'సిద్ధం', malpeLoaded: 'మాల్పే సందర్భం లోడ్ అయింది', agentsReady: 'ఏజెంట్లు సిద్ధంగా ఉన్నారు', demoContext: 'డెమో సందర్భం', localFixtures: 'స్థానిక డేటా',
    previewWorkspace: 'ప్రివ్యూ వర్క్‌స్పేస్', demoNotice: 'కింద ఉన్న రీడింగ్‌లు మరియు నిర్ణయాలు వాస్తవిక స్థానిక డెమో డేటా, లైవ్ భద్రతా సూచనలు కావు.',
    morningBrief: 'ఉదయపు సమాచారం · మంగళవారం, 18 జూన్ 2024', goodMorning: 'శుభోదయం, రవి.', seaBeforeLeave: 'మాల్పే హార్బర్ నుంచి బయలుదేరే ముందు సముద్రం చెబుతున్నది ఇది.', askOrca: 'ORCAని అడగండి', planTrip: 'యాత్ర ప్రణాళిక',
    departureVerdict: 'బయలుదేరే భద్రతా నిర్ణయం', canGoFishing: 'ఈరోజు చేపల వేటకు వెళ్లవచ్చా?', go: 'వెళ్లండి', caution: 'జాగ్రత్త', noGo: 'వెళ్లవద్దు', suitableNearshore: 'మాల్పే నుంచి తీరానికి దగ్గర ప్రయాణానికి పరిస్థితులు అనుకూలంగా ఉన్నాయి. 06:00కి ముందు బయలుదేరి 16:00కి తిరిగి రండి, ఎందుకంటే సముద్రంలో గాలులు పెరుగుతాయి. రేడియో వాచ్‌ను యాక్టివ్‌గా ఉంచండి.',
    confidence: 'నమ్మకం', evidenceCurrent: 'సాక్ష్యం తాజాది', validSixHours: '6 గంటలు చెల్లుతుంది', rightNow: 'ఇప్పుడు', coastalConditions: 'తీర పరిస్థితులు', waveHeight: 'అల ఎత్తు', wind: 'గాలి', swell: 'స్వెల్', visibility: 'దృశ్యమానత', seaTemp: 'సముద్ర ఉష్ణోగ్రత', chlorophyll: 'క్లోరోఫిల్', calm: 'ప్రశాంతం', steady: 'స్థిరంగా', southWest: 'దక్షిణ-పడమర', clear: 'స్పష్టం', normal: 'సాధారణం', goodPfz: 'మంచి PFZ సంకేతం', live: 'లైవ్', cached: 'క్యాష్డ్', stale: 'పాతది', unavailable: 'అందుబాటులో లేదు', hours: 'గంటలు', routeTo: 'కు',
    signals: 'గుర్తుంచుకోవాల్సిన సంకేతాలు', onlyChanges: 'మీ ప్రణాళికను మార్చగల విషయాలు మాత్రమే.', viewAll: 'అన్నీ చూడండి', waterAtGlance: 'మీ చుట్టూ ఉన్న నీరు', pfzActivity: 'మాల్పే చుట్టూ PFZ మరియు పడవల కార్యకలాపం.', openMap: 'పటం తెరవండి', selectedPfz: 'ఎంచుకున్న PFZ 04', yourVessel: 'మీ పడవ', howReached: 'ORCA ఈ సమాధానానికి ఎలా వచ్చింది', fiveAgents: 'ఐదు ప్రత్యేక ఏజెంట్లు ఒకే బయలుదేరు సమయాన్ని తనిఖీ చేశారు.', seeReasoning: 'కారణం చూడండి',
    marineAssistant: 'మెరైన్ ఇంటెలిజెన్స్ సహాయకుడు', clearerQuestion: 'సముద్రాన్ని స్పష్టంగా అడగండి.', evidenceTogether: 'ORCA వాతావరణం, సముద్రం, శాటిలైట్ మరియు పటం సాక్ష్యాలను కలిపి తన ప్రక్రియను చూపిస్తుంది.', orcaIntelligence: 'ORCA ఇంటెలిజెన్స్', underAnswer: 'సమాధానం వెనుక', agentReasoning: 'ఏజెంట్ కారణం', collaborativeTrace: 'సులభమైన భాషలో సహకార ప్రక్రియ.', verdictSigned: 'రిస్క్ ఏజెంట్ ధృవీకరించిన నిర్ణయం',
    firstMessage: 'శుభోదయం. మీ సాధారణ తీర ప్రయాణం కోసం మాల్పే చుట్టూ సముద్రాన్ని తనిఖీ చేశాను. ఏదైనా అడగండి లేదా కింద ఉన్న ప్రశ్నలను ఉపయోగించండి.', secondMessage: 'సంక్షిప్త సమాధానం: 16:00 వరకు వెళ్లవచ్చు. ఆ తర్వాత గాలులు పెరుగుతాయి, 42 కి.మీ దూరంలో మెరుపు సెల్ ఈశాన్యంగా కదులుతోంది.', checking: 'తాజా సందర్భాన్ని తనిఖీ చేస్తున్నాం…', you: 'మీరు', send: 'పంపండి', askPlaceholder: 'మీ యాత్ర, పరిస్థితులు లేదా ప్రదేశం గురించి అడగండి…', suggestionPfz: 'PFZ 04కి వెళ్లవచ్చా?', suggestionWhy: 'సమాధానం వెళ్లండి ఎందుకు?', suggestionWatch: 'ఏమి గమనించాలి?', suggestionReturn: 'సురక్షిత తిరుగు ప్రణాళిక',
    geospatial: 'భౌగోళిక వర్క్‌స్పేస్', waterAround: 'మీ చుట్టూ ఉన్న నీటిని చూడండి.', mapDescription: 'మాల్పే సమీపంలోని జోన్లు, పడవలు మరియు సరిహద్దుల కోసం సరళమైన ఆపరేషనల్ వీక్షణ.', allLayers: 'అన్ని లేయర్లు', pfzZones: 'PFZ జోన్లు', vessels: 'పడవలు', mapCache: 'పటం క్యాష్ · 09:31', worldIndia: 'ప్రపంచ వీక్షణ · భారత్ ఫోకస్', globalContext: 'ప్రపంచ సందర్భం', malpeHarbour: 'మాల్పే హార్బర్', arabianSea: 'అరేబియా సముద్రం', regulatedBoundary: 'నియంత్రిత సరిహద్దు', selectedArea: 'ఎంచుకున్న ప్రాంతం · భారత్ పశ్చిమ తీరం', fishingSignal: 'చేపల సంకేతం', fromMalpe: 'మాల్పే హార్బర్ నుంచి', latestPreview: 'తాజా స్థానిక ప్రివ్యూలో', satelliteSignal: 'శాటిలైట్ సంకేతం', details: 'వివరాలు', nearbyZones: 'సమీప చేపల జోన్లు', mapLayers: 'పటం లేయర్లు', nearbyVessels: 'సమీప పడవలు', vesselActivity: 'పడవల కార్యకలాపం', nearby: 'సమీపంలో', lastPosition: 'చివరి స్థానం 18 నిమిషాల క్రితం అందింది. మీ పడవ నేవీలో చూపబడుతుంది.', aisPositions: 'AIS స్థానాలు · 18 నిమిషాలు', searchPlace: 'హార్బర్ / బీచ్ / గ్రామం వెతకండి', layersOsm: 'లేయర్లు: OSM', fetchHere: 'ఇక్కడ డేటా పొందండి', fishHotspots: 'చేపల హాట్‌స్పాట్లు', zoomIn: 'జూమ్ ఇన్', zoomOut: 'జూమ్ అవుట్',
    alertsTitle: 'మీ దృష్టికి అవసరమైన అలర్ట్లు.', alertsEyebrow: 'చురుకైన గమనిక', alertsDescription: 'ఈరోజు సురక్షితంగా బయలుదేరడాన్ని ప్రభావితం చేసేవి ముందుగా చూపబడతాయి.', monitoring: '4 సంకేతాలను గమనిస్తున్నాం', allAlerts: 'అన్ని అలర్ట్లు', highPriority: 'అధిక ప్రాధాన్యత', mediumPriority: 'మధ్యస్థ ప్రాధాన్యత', lowPriority: 'తక్కువ ప్రాధాన్యత', showing: 'చూపిస్తున్నాం', nothingElse: 'ఇంకేమీ మీ దృష్టికి అవసరం లేదు.', alertGuidance: 'అలర్ట్ మార్గదర్శకం', readSignal: 'రంగు మాత్రమే కాదు, సంకేతాన్ని చదవండి.', alertGuidanceCopy: 'ఎరుపు అలర్ట్ అంటే తప్పనిసరిగా నో-గో కాదు. అది ఎక్కడ ఉంది, ఎప్పుడు వస్తుంది, మీ మార్గాన్ని తాకుతుందా అని ORCA చూస్తుంది.', newlyObserved: 'ఇప్పుడే గమనించబడింది', availableOffline: 'ఆఫ్‌లైన్‌లో అందుబాటులో ఉంది', useCaution: 'జాగ్రత్తగా ఉపయోగించండి',
    routeEyebrow: 'యాత్ర ప్రణాళిక', routeTitle: 'బయలుదేరే ముందు మార్గాన్ని తెలుసుకోండి.', routeDescription: 'బయలుదేరు సమయం, గమ్యం మరియు పరిస్థితులను ఒకే ప్రశాంతమైన వీక్షణలో పోల్చండి.', riskReady: 'రిస్క్ ఇంజిన్ సిద్ధం', buildTrip: 'యాత్రను రూపొందించండి', heading: 'మీరు ఎక్కడికి వెళ్తున్నారు?', departurePoint: 'బయలుదేరు స్థలం', destinationZone: 'గమ్యం లేదా చేపల జోన్', leaveAt: 'బయలుదేరు సమయం', duration: 'యాత్ర వ్యవధి', checkSafety: 'మార్గ భద్రతను తనిఖీ చేయండి', routeResult: 'మార్గ భద్రత ఫలితం', routeSuitable: 'మాల్పే నుంచి మీ మార్గం', suitableIf: 'మీరు ఈ సమయంలో బయలుదేరితే అనుకూలం', returnBefore: 'సముద్రంలో గాలులు పెరగకముందే 16:00కి తిరిగి రండి.', nauticalMiles: 'నాటికల్ మైళ్లు', peakWave: 'గరిష్ఠ అల', returnBy: 'తిరిగి రావాలి', whyRoute: 'ఈ మార్గం ఎందుకు అనుకూలం', clearWindow: 'స్పష్టమైన బయలుదేరు సమయం', clearWindowCopy: 'మొదటి 4 గంటలు గాలి మరియు అలల జాగ్రత్త పరిమితి కంటే తక్కువగా ఉంటాయి.', boundaryChecked: 'సరిహద్దు దూరం తనిఖీ అయింది', boundaryCopy: 'మార్గం సీజనల్ నియంత్రిత సరిహద్దు నుంచి 3.8 నాటికల్ మైళ్ల దూరంలో ఉంటుంది.', enterTrip: 'మార్గ భద్రతా సమాధానం కోసం మీ యాత్ర వివరాలను నమోదు చేయండి.', sameEvidence: 'ORCA మీ అవలోకనంలోని అదే సాక్ష్యాన్ని తనిఖీ చేస్తుంది.',
    fieldGuide: 'ORCA ఫీల్డ్ గైడ్', clarity: 'నీటి అంచున స్పష్టత.', fieldGuideCopy: 'సురక్షితమైన నిర్ణయం తీసుకోవడంలో ORCA ఎలా సహాయపడుతుందో సంక్షిప్తంగా.', plainLanguage: 'ముందుగా సరళమైన భాష', orcaAnswers: 'ORCA “నేను వెళ్లవచ్చా?” అని సమాధానం ఇస్తుంది', plainLanguageCopy: 'వాతావరణం, అలలు, సముద్ర రంగు, శాటిలైట్ నౌకాస్ట్‌లు మరియు పటం సరిహద్దుల వంటి సంకేతాలను ORCA ఒక స్పష్టమైన సమాధానంగా మారుస్తుంది. నిర్ణయం, సమయ పరిధి మరియు కారణాలు కనిపిస్తాయి.', verdicts: 'నిర్ణయాలు', signedOutputs: 'వెళ్లండి, జాగ్రత్త లేదా వెళ్లవద్దు అనేవి ధృవీకరించిన ఫలితాలు.', verdictCopy: 'ప్రత్యేక ఏజెంట్లు సాక్ష్యాలను పోల్చిన తర్వాత రిస్క్ సేవ భద్రతా నిర్ణయం ఇస్తుంది. బ్రౌజర్‌లో యాప్ నిర్ణయాన్ని లెక్కించదు. ప్రతి సమాధానానికి స్థలం, చెల్లుబాటు సమయం మరియు నమ్మకం ఉంటుంది.', goSuitable: 'వెళ్లండి · అనుకూలం', cautionPlan: 'జాగ్రత్త · ప్రణాళికతో వెళ్లండి', noGoStay: 'వెళ్లవద్దు · ఒడ్డున ఉండండి', signalDrops: 'సంకేతం తగ్గినప్పుడు', offline: 'ఆఫ్‌లైన్‌లో ఉపయోగకరం, పరిమితులపై నిజాయితీ.', offlineCopy: 'కవరేజ్ పోయినప్పుడు తాజా విశ్వసనీయ నిర్ణయం మరియు భద్రతా సంకేతాలు అందుబాటులో ఉండవచ్చు. ORCA ప్రతి సాక్ష్యాన్ని LIVE, CACHED, STALE లేదా UNAVAILABLEగా చూపిస్తుంది.', evidenceBrief: 'బ్రీఫ్‌లోని సాక్ష్యం', aiRole: 'AI పాత్ర', aiRoleTitle: 'నమ్మకమైన సహచరుడిలా సహాయం.', aiRoleCopy: 'AI ప్రత్యేక తనిఖీలను సమన్వయం చేసి ఫలితాన్ని వివరించడానికి ఉపయోగపడుతుంది. ఇది పరిశీలనలను కల్పించదు, అధికారిక హెచ్చరికను భర్తీ చేయదు.', officialNote: 'ORCAతో పాటు ఎల్లప్పుడూ అధికారిక స్థానిక సూచనలు మరియు మీ నావికా పరిజ్ఞానాన్ని ఉపయోగించండి.', madeCoast: 'తీరం కోసం రూపొందించబడింది', smallScreen: 'చిన్న స్క్రీన్. పెద్ద ప్రభావం.', smallScreenCopy: 'మత్స్యకారులు, తీర అధికారులు మరియు సముద్ర ఆపరేటర్లకు — English, हिन्दी లేదా తెలుగు లో త్వరగా ఉపయోగపడే సమాధానాల కోసం రూపొందించబడింది.',
    weatherLightning: 'వాతావరణం మరియు మెరుపు', oceanConditions: 'సముద్ర పరిస్థితులు', satellitePfz: 'శాటిలైట్ మరియు PFZ', boundariesNotices: 'సరిహద్దులు మరియు నోటీసులు', imdInsat: 'IMD తీర అంచనా · INSAT-3D', buoyWave: 'బోయ్ పరిశీలనలు · అలల మోడల్', oceanColour: 'సముద్ర రంగు · క్లోరోఫిల్ సంకేతం', coastalAuthority: 'తీర అధికార డేటాసెట్లు',
    planner: 'ప్లానర్ ఏజెంట్', plannerNote: '06:00–16:00 యాత్ర కోసం ప్రశ్నను రూపొందించారు', weatherAgent: 'వాతావరణ ఏజెంట్', weatherNote: 'గాలి మరియు మెరుపు సెల్‌ను తీర అంచనాతో తనిఖీ చేశారు', oceanAgent: 'సముద్ర ఏజెంట్', oceanNote: 'అల, స్వెల్ మరియు దృశ్యమానతను కలిపారు', geoAgent: 'భౌగోళిక ఏజెంట్', geoNote: 'PFZ 04 మరియు సరిహద్దు దూరాన్ని ధృవీకరించారు', riskAgent: 'రిస్క్ ఏజెంట్', riskNote: 'తిరుగు సమయంతో వెళ్లండి నిర్ణయం ఇచ్చారు',
    alertWindTitle: 'సముద్రంలో బలమైన గాలులు పెరుగుతున్నాయి', alertWindBody: '16:00 తర్వాత గాలి 28 కి.మీ/గం వరకు చేరవచ్చు. తిరుగు మార్గాన్ని తీరానికి దగ్గరగా ఉంచండి.', alertLightningTitle: 'ఆగ్నేయంలో 42 కి.మీ దూరంలో మెరుపు సెల్', alertLightningBody: 'వేగంగా కదిలే సెల్ ఈశాన్యంగా వెళ్తోంది. 15:30కి ముందు తిరిగి రావాలని ORCA సూచిస్తుంది.', alertBoundaryTitle: 'PFZ 04 ముందు సీజనల్ సరిహద్దు', alertBoundaryBody: 'ఎంచుకున్న జోన్ నియంత్రిత చేపల సరిహద్దు నుంచి 3.8 నాటికల్ మైళ్ల దూరంలో ఉంది.', alertVisibilityTitle: 'తీరం దగ్గర దృశ్యమానత స్పష్టంగా ఉంది', alertVisibilityBody: 'బయలుదేరు స్థలంలో దృశ్యమానత 8.4 కి.మీగా ఉంది, నావిగేషన్‌కు అనుకూలంగా ఉంది.', coastalForecast: 'IMD తీర అంచనా', insat: 'INSAT-3D నౌకాస్ట్', authorityNotice: 'తీర అధికారి నోటీసు', buoy: 'బోయ్ KA-07',
    moderateSignal: 'మధ్యస్థ సంకేతం', strongSignal: 'బలమైన సంకేతం', freshObservation: 'తాజా పరిశీలన', issuedGo: 'తిరుగు సమయంతో వెళ్లండి నిర్ణయం ఇచ్చారు',
  },
} as const;

type CopyKey = keyof typeof translations.English;
const LanguageContext = createContext<{ language: Language; t: (key: CopyKey) => string }>({ language: 'English', t: (key) => translations.English[key] });
function useLanguage() { return useContext(LanguageContext); }

const navItems = [
  { href: '/', key: 'navOverview' as CopyKey, icon: PanelTop },
  { href: '/assistant', key: 'navAssistant' as CopyKey, icon: MessageCircle },
  { href: '/map', key: 'navMap' as CopyKey, icon: MapIcon },
  { href: '/alerts', key: 'navAlerts' as CopyKey, icon: Bell },
  { href: '/route', key: 'navRoute' as CopyKey, icon: RouteIcon },
];

const alerts = [
  { id: 'wind-01', severity: 'HIGH' as AlertSeverity, icon: Wind, titleKey: 'alertWindTitle' as CopyKey, bodyKey: 'alertWindBody' as CopyKey, time: '12 min ago', sourceKey: 'coastalForecast' as CopyKey },
  { id: 'lightning-02', severity: 'HIGH' as AlertSeverity, icon: CloudLightning, titleKey: 'alertLightningTitle' as CopyKey, bodyKey: 'alertLightningBody' as CopyKey, time: '31 min ago', sourceKey: 'insat' as CopyKey },
  { id: 'boundary-03', severity: 'MEDIUM' as AlertSeverity, icon: Globe2, titleKey: 'alertBoundaryTitle' as CopyKey, bodyKey: 'alertBoundaryBody' as CopyKey, time: '1 hr ago', sourceKey: 'authorityNotice' as CopyKey },
  { id: 'visibility-04', severity: 'LOW' as AlertSeverity, icon: Waves, titleKey: 'alertVisibilityTitle' as CopyKey, bodyKey: 'alertVisibilityBody' as CopyKey, time: '2 hr ago', sourceKey: 'buoy' as CopyKey },
];

const traces = [
  { labelKey: 'planner' as CopyKey, noteKey: 'plannerNote' as CopyKey, icon: Compass },
  { labelKey: 'weatherAgent' as CopyKey, noteKey: 'weatherNote' as CopyKey, icon: Wind },
  { labelKey: 'oceanAgent' as CopyKey, noteKey: 'oceanNote' as CopyKey, icon: Waves },
  { labelKey: 'geoAgent' as CopyKey, noteKey: 'geoNote' as CopyKey, icon: Globe2 },
  { labelKey: 'riskAgent' as CopyKey, noteKey: 'riskNote' as CopyKey, icon: ShieldCheck },
];

function FreshnessBadge({ status, text }: { status: Freshness; text?: string }) {
  const { t } = useLanguage();
  const className = status.toLowerCase();
  const localizedStatus = status === 'LIVE' ? t('live') : status === 'CACHED' ? t('cached') : status === 'STALE' ? t('stale') : t('unavailable');
  return <span className={`orca-status orca-status-${className}`} data-testid={`status-freshness-${className}`}><span className="orca-dot" />{text ?? localizedStatus}</span>;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [language, setLanguage] = useState<Language>('English');
  const [refreshedAt, setRefreshedAt] = useState('09:42 IST');
  const refresh = () => setRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const t = (key: CopyKey) => translations[language][key];

  return (
    <LanguageContext.Provider value={{ language, t }}>
    <div className="orca-shell" lang={language === 'English' ? 'en' : language === 'हिन्दी' ? 'hi' : 'te'}>
      <aside className="orca-sidebar">
        <Link href="/" className="orca-logo" data-testid="link-logo">
          <span className="orca-mark"><Fish size={19} strokeWidth={2.2} /></span>
          <span>ORCA<span style={{ color: '#1ab5b1' }}>.</span></span>
        </Link>
        <div className="orca-nav">
          <div className="orca-eyebrow" style={{ padding: '0 13px', marginBottom: 9 }}>{t('companion')}</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location === item.href;
            return <Link key={item.href} href={item.href} className={`orca-nav-link ${active ? 'active' : ''}`} data-testid={`link-nav-${item.key}`}><Icon size={16} strokeWidth={active ? 2.4 : 1.9} /><span className="orca-nav-label">{t(item.key)}</span>{item.href === '/alerts' && <span style={{ background: '#e85e4f', color: '#fff', borderRadius: 99, padding: '2px 5px', fontSize: 9 }}>2</span>}</Link>;
          })}
        </div>
        <div style={{ marginTop: 25 }}>
          <Link href="/about" className={`orca-nav-link ${location === '/about' ? 'active' : ''}`} data-testid="link-nav-about"><CircleHelp size={16} /><span className="orca-nav-label">{t('navAbout')}</span></Link>
        </div>
        <div className="orca-sidebar-foot">
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', color: '#3b7880', fontWeight: 800, marginBottom: 5 }}><span className="orca-dot orca-dot-pulse" style={{ color: '#27b59b' }} />{t('demoMode')}</div>
          {t('localPreview')}<br />{t('noLive')}
        </div>
      </aside>
      <main className="orca-main">
        <header className="orca-topbar">
          <Link href="/" className="orca-mobile-brand" data-testid="link-mobile-logo">
            <span className="orca-mark"><Fish size={16} strokeWidth={2.2} /></span>
            <span>ORCA<span style={{ color: '#1ab5b1' }}>.</span></span>
          </Link>
          <div className="orca-statusline"><span className="orca-dot orca-dot-pulse" />{t('coastalKarnataka')} · <span className="font-mono-orca">12°58'N 74°50'E</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="orca-icon-button" onClick={refresh} title={t('refresh')} data-testid="button-refresh-data"><RefreshCw size={14} /></button>
            <span className="font-mono-orca" style={{ color: '#78919a', fontSize: 10 }} data-testid="text-last-refresh">{t('updated')} {refreshedAt}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} style={{ border: '1px solid #d7e7e8', borderRadius: 9, background: '#fff', color: '#315d6a', padding: '7px 8px', fontSize: 11, fontWeight: 700 }} data-testid="select-language" aria-label="Language">
              <option>English</option><option>हिन्दी</option><option>తెలుగు</option>
            </select>
            <button className="orca-icon-button" style={{ display: 'none' }} aria-label="Open menu" data-testid="button-open-menu"><Menu size={16} /></button>
          </div>
        </header>
        <div className="orca-content">{children}</div>
      </main>
      <nav className="orca-mobile-nav">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const mobileLabel = item.href === '/' ? t('home') : item.href === '/assistant' ? t('navAssistant') : item.href === '/map' ? t('map') : t('navAlerts');
          return <Link key={item.href} href={item.href} className={`orca-mobile-link ${location === item.href ? 'active' : ''}`} data-testid={`link-mobile-${item.key}`}><Icon size={18} /><span>{mobileLabel}</span></Link>;
        })}
        <Link href="/about" className={`orca-mobile-link ${location === '/about' ? 'active' : ''}`} data-testid="link-mobile-about"><CircleHelp size={18} /><span>{t('about')}</span></Link>
      </nav>
    </div>
    </LanguageContext.Provider>
  );
}

function DemoBanner() {
  const { t } = useLanguage();
  return <div className="orca-demo-banner" data-testid="banner-demo-mode"><span><strong>{t('previewWorkspace')}</strong> · {t('demoNotice')}</span><FreshnessBadge status="CACHED" text={t('localFixtures')} /></div>;
}

function Overview() {
  const { t } = useLanguage();
  return <div>
    <DemoBanner />
    <div className="orca-page-head">
      <div><div className="orca-eyebrow">{t('morningBrief')}</div><h1 className="orca-h1">{t('goodMorning')}</h1><p className="orca-muted" style={{ margin: 0 }}>{t('seaBeforeLeave')}</p></div>
      <div className="orca-page-actions"><Link href="/assistant" className="orca-button orca-button-primary" data-testid="link-ask-orca"><MessageCircle size={15} />{t('askOrca')}</Link><Link href="/route" className="orca-button orca-button-outline" data-testid="link-plan-trip"><Navigation size={14} />{t('planTrip')}</Link></div>
    </div>
    <div className="orca-grid-home">
      <section className="orca-card orca-verdict" data-testid="card-safety-verdict">
        <div className="orca-verdict-content">
          <div className="orca-eyebrow">{t('departureVerdict')}</div>
          <div className="orca-verdict-title">{t('canGoFishing')}</div>
          <div className="orca-go" data-testid="status-verdict-go">{t('go')}</div>
          <p className="orca-verdict-copy">{t('suitableNearshore')}</p>
          <div className="orca-meta-row"><span className="orca-meta-chip"><ShieldCheck size={13} />{t('confidence')} 87%</span><span className="orca-meta-chip"><FreshnessBadge status="LIVE" text={t('evidenceCurrent')} /></span><span className="orca-meta-chip"><ClockIcon />{t('validSixHours')}</span></div>
          <div className="orca-location-line"><Navigation size={14} />Malpe, Karnataka <span style={{ opacity: .5 }}>·</span> 12°58'N 74°50'E</div>
        </div>
      </section>
      <section>
        <div className="orca-card orca-card-pad" data-testid="card-current-conditions">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div className="orca-eyebrow">{t('rightNow')}</div><div className="orca-h2" style={{ marginTop: 5 }}>{t('coastalConditions')}</div></div><FreshnessBadge status="LIVE" /></div>
          <div className="orca-mini-summary">
            <Metric icon={<Waves size={15} />} label={t('waveHeight')} value="0.8" unit="m" foot={t('calm')} />
            <Metric icon={<Wind size={15} />} label={t('wind')} value="14" unit="km/h" foot={`ENE · ${t('steady')}`} />
            <Metric icon={<Waves size={15} />} label={t('swell')} value="1.1" unit="m" foot={t('southWest')} />
            <Metric icon={<Gauge size={15} />} label={t('visibility')} value="8.4" unit="km" foot={t('clear')} />
            <Metric icon={<Thermometer size={15} />} label={t('seaTemp')} value="28.1" unit="°C" foot={t('normal')} />
            <Metric icon={<Database size={15} />} label={t('chlorophyll')} value="0.42" unit="mg/m³" foot={t('goodPfz')} />
          </div>
        </div>
      </section>
    </div>
    <div className="orca-columns">
      <section>
        <div className="orca-section-row"><div><div className="orca-h2">{t('signals')}</div><p className="orca-muted">{t('onlyChanges')}</p></div><Link href="/alerts" className="orca-button orca-button-ghost" data-testid="link-view-all-alerts">{t('viewAll')} <ArrowRight size={13} /></Link></div>
        <div className="orca-card orca-card-pad" data-testid="list-priority-alerts">{alerts.slice(0, 3).map((alert) => <AlertItem key={alert.id} alert={alert} />)}</div>
      </section>
      <section>
        <div className="orca-section-row"><div><div className="orca-h2">{t('waterAtGlance')}</div><p className="orca-muted">{t('pfzActivity')}</p></div><Link href="/map" className="orca-button orca-button-ghost" data-testid="link-open-map">{t('openMap')} <ArrowRight size={13} /></Link></div>
        <div className="orca-card orca-card-pad" data-testid="card-map-overview"><div className="orca-map-preview"><span className="orca-map-label" style={{ left: 14, top: 18 }}>{t('malpeHarbour')}</span><span className="orca-map-label" style={{ right: 17, bottom: 22 }}>{t('arabianSea')}</span><div className="orca-zone" /><div className="orca-vessel" /></div><div className="orca-map-legend"><span><i className="zone-dot" />{t('selectedPfz')}</span><span><i />{t('yourVessel')}</span></div></div>
      </section>
    </div>
    <section>
      <div className="orca-section-row"><div><div className="orca-h2">{t('howReached')}</div><p className="orca-muted">{t('fiveAgents')}</p></div><Link href="/assistant" className="orca-button orca-button-ghost" data-testid="link-see-reasoning">{t('seeReasoning')} <ArrowRight size={13} /></Link></div>
      <div className="orca-card orca-card-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 10 }} data-testid="list-agent-trace">{traces.map((trace, index) => <div key={trace.labelKey} className="orca-trace" style={{ display: 'block', borderBottom: 0, padding: 0 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="orca-trace-icon"><trace.icon size={14} /></div><span className="font-mono-orca" style={{ color: '#9aaeb2', fontSize: 10 }}>0{index + 1}</span></div><div className="orca-trace-name" style={{ marginTop: 10 }}>{t(trace.labelKey)}</div><div className="orca-trace-note">{t(trace.noteKey)}</div></div>)}</div>
    </section>
  </div>;
}

function ClockIcon() { return <span style={{ width: 13, height: 13, border: '1px solid currentColor', borderRadius: '50%', display: 'inline-block', position: 'relative' }} />; }

function Metric({ icon, label, value, unit, foot }: { icon: ReactNode; label: string; value: string; unit: string; foot: string }) {
  return <div className="orca-metric" data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}><div style={{ color: '#159a99', display: 'flex', alignItems: 'center', gap: 6 }}><span>{icon}</span><span className="orca-metric-label">{label}</span></div><div className="orca-metric-value">{value}<span className="orca-metric-unit">{unit}</span></div><div className="orca-metric-foot">{foot}</div></div>;
}

function AlertItem({ alert }: { alert: typeof alerts[number] }) {
  const { t } = useLanguage();
  const Icon = alert.icon;
  const tone = alert.severity === 'HIGH' ? 'danger' : alert.severity === 'MEDIUM' ? 'warn' : 'info';
  return <div className="orca-alert-item" data-testid={`alert-summary-${alert.id}`}><div className={`orca-alert-icon ${tone}`}><Icon size={15} /></div><div><div className="orca-alert-title">{t(alert.titleKey)}</div><div className="orca-alert-sub">{t(alert.bodyKey)}</div></div><span className={`orca-status ${alert.severity === 'HIGH' ? 'orca-status-unavailable' : alert.severity === 'MEDIUM' ? 'orca-status-stale' : 'orca-status-cached'}`} style={{ alignSelf: 'flex-start' }}>{alert.severity === 'HIGH' ? t('noGo') : alert.severity === 'MEDIUM' ? t('caution') : t('go')}</span></div>;
}

function Assistant() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; text: string }[]>([
    { role: 'assistant', text: t('firstMessage') },
    { role: 'assistant', text: t('secondMessage') },
  ]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || thinking) return;
    setMessages((current) => [...current, { role: 'user', text }]);
    setDraft('');
    setThinking(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', text: `${t('demoNotice')} ${t('go')} · 16:00.` }]);
      setThinking(false);
    }, 650);
  };
  const suggestions = [t('suggestionPfz'), t('suggestionWhy'), t('suggestionWatch'), t('suggestionReturn')];
  return <div className="orca-assistant-page">
    <DemoBanner />
    <div className="orca-page-head"><div><div className="orca-eyebrow">{t('marineAssistant')}</div><h1 className="orca-h1">{t('clearerQuestion')}</h1><p className="orca-muted" style={{ margin: 0 }}>{t('evidenceTogether')}</p></div><FreshnessBadge status="LIVE" text={t('agentsReady')} /></div>
    <div className="orca-assistant-layout">
      <section className="orca-card orca-chat" data-testid="panel-assistant-chat">
        <div className="orca-chat-head"><div className="orca-agent-chip"><div className="orca-agent-avatar"><Bot size={18} /></div><div><div style={{ fontSize: 13, color: '#244b5a', fontWeight: 800 }}>{t('orcaIntelligence')}</div><div className="orca-statusline" style={{ marginTop: 3 }}><span className="orca-dot orca-dot-pulse" />{t('ready')} · {t('malpeLoaded')}</div></div></div><FreshnessBadge status="CACHED" text={t('demoContext')} /></div>
        <div className="orca-chat-body">{messages.map((message, index) => <div className={`orca-msg ${message.role}`} key={`${message.role}-${index}`} data-testid={`message-${message.role}-${index}`}>{message.role === 'assistant' && <div className="orca-agent-avatar" style={{ width: 27, height: 27, borderRadius: 8 }}><Bot size={14} /></div>}<div><div className="orca-msg-label">{message.role === 'assistant' ? 'ORCA' : t('you')}</div><div className="orca-bubble">{message.text}</div></div></div>)}{thinking && <div className="orca-msg assistant"><div className="orca-agent-avatar" style={{ width: 27, height: 27, borderRadius: 8 }}><Bot size={14} /></div><div><div className="orca-msg-label">ORCA</div><div className="orca-bubble"><span className="orca-statusline"><span className="orca-dot orca-dot-pulse" />{t('checking')}</span></div></div></div>}</div>
        <div className="orca-chat-footer"><div className="orca-suggested">{suggestions.map((suggestion) => <button key={suggestion} className="orca-suggestion" onClick={() => setDraft(suggestion)} data-testid={`button-suggestion-${suggestion.slice(0, 8).replaceAll(' ', '-').toLowerCase()}`}>{suggestion}</button>)}</div><form className="orca-compose" onSubmit={sendMessage}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={t('askPlaceholder')} aria-label={t('askPlaceholder')} data-testid="input-assistant-message" /><button className="orca-button orca-button-primary" type="submit" disabled={!draft.trim() || thinking} data-testid="button-send-message"><Send size={14} />{t('send')}</button></form></div>
      </section>
      <aside className="orca-card orca-card-pad" data-testid="panel-agent-reasoning"><div className="orca-eyebrow">{t('underAnswer')}</div><div className="orca-h2" style={{ marginTop: 6, marginBottom: 5 }}>{t('agentReasoning')}</div><p className="orca-muted" style={{ fontSize: 11, marginTop: 0 }}>{t('collaborativeTrace')}</p>{traces.map((trace, index) => <div className="orca-reason-step" key={trace.labelKey}><div className="orca-reason-number">{index + 1}</div><div><div className="orca-reason-name">{t(trace.labelKey)}</div><div className="orca-reason-copy">{t(trace.noteKey)}</div></div></div>)}<div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #e4eff0' }}><FreshnessBadge status="LIVE" text={t('verdictSigned')} /></div></aside>
    </div>
  </div>;
}

function MapWorkspace() {
  const { t } = useLanguage();
  const [layers, setLayers] = useState({ zones: true, vessels: true, boundaries: true });
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [selectedZone, setSelectedZone] = useState('PFZ 04');
  const zones = [
    { id: 'PFZ 04', distance: '8.2 nm SW', signalKey: 'strongSignal' as CopyKey, status: 'GO' },
    { id: 'PFZ 02', distance: '12.6 nm W', signalKey: 'moderateSignal' as CopyKey, status: 'CAUTION' },
    { id: 'PFZ 07', distance: '18.1 nm S', signalKey: 'freshObservation' as CopyKey, status: 'GO' },
  ];
  const activeZone = zones.find((zone) => zone.id === selectedZone) ?? zones[0];
  const toggle = (key: keyof typeof layers) => setLayers((current) => ({ ...current, [key]: !current[key] }));
  return <div className="orca-map-page">
    <DemoBanner />
    <div className="orca-page-head"><div><div className="orca-eyebrow">{t('geospatial')}</div><h1 className="orca-h1">{t('waterAround')}</h1><p className="orca-muted" style={{ margin: 0 }}>{t('mapDescription')}</p></div><div className="orca-control-row"><div className="orca-segmented">{[{ id: 'all', label: t('allLayers') }, { id: 'zones', label: t('pfzZones') }, { id: 'vessels', label: t('vessels') }].map((layer) => <button key={layer.id} className={selectedLayer === layer.id ? 'active' : ''} onClick={() => setSelectedLayer(layer.id)} data-testid={`button-map-layer-${layer.id}`}>{layer.label}</button>)}</div><FreshnessBadge status="CACHED" text={t('mapCache')} /></div></div>
    <div className="orca-map-workspace">
      <section className="orca-big-map" data-testid="map-canvas">
        <div className="orca-map-heading"><Globe2 size={14} /> {t('worldIndia')}</div>
        <div className="orca-map-mobile-controls">
          <div className="orca-map-search"><span><MapIcon size={16} />{t('searchPlace')}</span><ArrowRight size={18} /></div>
          <div className="orca-map-pills"><button><Layers3 size={14} />{t('layersOsm')}</button><button><Navigation size={14} />{t('fetchHere')}</button></div>
        </div>
        <svg className="orca-world-map" viewBox="0 0 900 540" role="img" aria-label="Stylized world map focused on India's west coast">
          <defs>
            <pattern id="orca-grid" width="90" height="54" patternUnits="userSpaceOnUse">
              <path d="M 90 0 L 0 0 0 54" fill="none" stroke="rgba(41,144,150,.18)" strokeWidth="1" />
            </pattern>
            <linearGradient id="orca-land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3e9d6" />
              <stop offset="100%" stopColor="#e7d8bc" />
            </linearGradient>
          </defs>
          <rect width="900" height="540" fill="url(#orca-grid)" />
          <path className="orca-landmass" d="M63 157 98 126 146 119 174 138 180 168 164 190 132 197 105 184 75 190Z" />
          <path className="orca-landmass" d="M191 94 238 77 291 84 324 105 350 139 341 169 313 185 287 177 266 198 247 185 218 181 199 153 178 133Z" />
          <path className="orca-landmass" d="M202 211 238 221 258 249 248 287 225 313 207 347 184 334 172 296 179 261Z" />
          <path className="orca-landmass" d="M345 94 391 77 450 82 493 98 541 91 583 111 629 102 679 124 728 145 772 172 801 210 790 243 756 258 715 250 687 276 652 263 624 282 602 259 570 268 549 238 512 227 488 201 449 204 419 180 381 177 358 147Z" />
          <path className="orca-landmass" d="M615 300 636 309 649 333 645 355 632 376 620 399 604 383 596 360 583 342 591 323Z" />
          <path className="orca-landmass" d="M726 360 765 350 804 367 820 395 808 427 774 438 738 425 715 396Z" />
          <path className="orca-india" d="M583 256 599 252 617 263 632 276 646 291 652 309 644 324 633 338 625 360 613 345 604 326 591 311 580 292 575 273Z" style={{ opacity: layers.zones ? 1 : .15 }} />
          <path className="orca-coastline" d="M583 256 575 273 580 292 591 311 604 326 613 345 625 360" />
          <ellipse className="orca-pfz-halo" cx="565" cy="301" rx="56" ry="38" style={{ opacity: layers.zones ? 1 : .08 }} />
          <circle className="orca-harbour-dot" cx="579" cy="315" r="7" style={{ opacity: layers.vessels ? 1 : .18 }} />
          <circle className="orca-vessel-dot" cx="548" cy="350" r="8" style={{ opacity: layers.vessels ? 1 : .12 }} />
          <path className="orca-boundary-line" d="M641 235 C684 251 694 287 679 328 C667 359 684 381 710 394" style={{ opacity: layers.boundaries ? 1 : .12 }} />
          <text className="orca-map-svg-label" x="548" y="220">INDIA</text>
          <text className="orca-map-svg-label small" x="520" y="384">MALPE</text>
          <text className="orca-map-svg-label small" x="500" y="289">{t('arabianSea').toUpperCase()}</text>
          <text className="orca-map-svg-label small" x="645" y="228">BANGLADESH</text>
        </svg>
        <span className="orca-map-label" style={{ left: 24, top: 25 }}>{t('malpeHarbour')} · 12°58'N</span>
        <span className="orca-map-label" style={{ right: 25, bottom: 27 }}>{t('globalContext')}</span>
        <div className="orca-map-compass">N</div>
        <div className="orca-map-zone-tag" style={{ opacity: layers.zones ? 1 : .1 }}>PFZ 04 · SELECTED</div>
        <div className="orca-map-boundary-tag" style={{ opacity: layers.boundaries ? 1 : .1 }}>{t('regulatedBoundary')}</div>
        <div className="orca-map-zoom"><button onClick={() => undefined} aria-label={t('zoomIn')} data-testid="button-map-zoom-in">+</button><button onClick={() => undefined} aria-label={t('zoomOut')} data-testid="button-map-zoom-out">−</button></div>
        <div className="orca-map-bottom-sheet"><span className="orca-sheet-handle" /><strong>{t('fishHotspots')}</strong><div className="orca-sheet-zone"><span>{activeZone.id} · {t(activeZone.signalKey)}</span><span className={`orca-zone-status ${activeZone.status.toLowerCase()}`}>{activeZone.status === 'GO' ? t('go') : t('caution')}</span></div></div>
      </section>
      <aside className="orca-map-side">
        <div className="orca-card orca-card-pad"><div className="orca-eyebrow">{t('selectedArea')}</div><div className="orca-h2" style={{ marginTop: 6 }}>{activeZone.id}</div><p className="orca-muted" style={{ fontSize: 11, margin: '5px 0 14px' }}>{t('fishingSignal')} {activeZone.distance} {t('fromMalpe')} {t(activeZone.signalKey)} {t('latestPreview')}.</p><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><FreshnessBadge status="LIVE" text={t('satelliteSignal')} /><button className="orca-button orca-button-ghost" onClick={() => undefined} data-testid="button-zone-details">{t('details')} <ArrowRight size={12} /></button></div></div>
        <div className="orca-card orca-card-pad"><div className="orca-eyebrow">{t('nearbyZones')}</div><div className="orca-zone-list">{zones.map((zone) => <button key={zone.id} className={`orca-zone-row ${selectedZone === zone.id ? 'selected' : ''}`} onClick={() => setSelectedZone(zone.id)} data-testid={`button-select-zone-${zone.id.toLowerCase().replace(' ', '-')}`}><span><strong>{zone.id}</strong><small>{zone.distance} · {t(zone.signalKey)}</small></span><span className={`orca-zone-status ${zone.status.toLowerCase()}`}>{zone.status === 'GO' ? t('go') : t('caution')}</span></button>)}</div></div>
        <div className="orca-card orca-card-pad"><div className="orca-eyebrow">{t('mapLayers')}</div>{[['zones', 'pfzZones', Layers3], ['vessels', 'nearbyVessels', Ship], ['boundaries', 'regulatedBoundary', ShieldCheck]].map(([key, labelKey, Icon]) => <div className="orca-layer" key={key as string}><span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon size={14} color="#188f90" />{t(labelKey as CopyKey)}</span><button className={`orca-switch ${layers[key as keyof typeof layers] ? 'on' : ''}`} onClick={() => toggle(key as keyof typeof layers)} aria-label={`${t('mapLayers')} ${t(labelKey as CopyKey)}`} data-testid={`button-toggle-${key}`}><span /></button></div>)}</div>
        <div className="orca-card orca-card-pad"><div className="orca-eyebrow">{t('vesselActivity')}</div><div className="orca-h2" style={{ marginTop: 6 }}>7 {t('nearby')}</div><p className="orca-muted" style={{ fontSize: 11, margin: '5px 0 0' }}>{t('lastPosition')}</p><div style={{ marginTop: 14 }}><FreshnessBadge status="STALE" text={t('aisPositions')} /></div></div>
      </aside>
    </div>
  </div>;
}

function AlertsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | AlertSeverity>('ALL');
  const [dismissed, setDismissed] = useState<string[]>([]);
  const shown = alerts.filter((alert) => (filter === 'ALL' || alert.severity === filter) && !dismissed.includes(alert.id));
  return <div>
    <DemoBanner />
    <div className="orca-page-head"><div><div className="orca-eyebrow">{t('alertsEyebrow')}</div><h1 className="orca-h1">{t('alertsTitle')}</h1><p className="orca-muted" style={{ margin: 0 }}>{t('alertsDescription')}</p></div><FreshnessBadge status="LIVE" text={t('monitoring')} /></div>
    <div className="orca-alerts-grid">
      <section className="orca-card"><div className="orca-filter-bar">{(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((item) => <button key={item} className={`orca-filter ${filter === item ? 'active' : ''}`} onClick={() => setFilter(item)} data-testid={`button-filter-${item.toLowerCase()}`}>{item === 'ALL' ? t('allAlerts') : item === 'HIGH' ? t('highPriority') : item === 'MEDIUM' ? t('mediumPriority') : t('lowPriority')}</button>)}<span style={{ marginLeft: 'auto', color: '#8aa0a5', fontSize: 10 }} data-testid="text-alert-count">{shown.length} {t('showing')}</span></div>{shown.length > 0 ? shown.map((alert) => <FeedAlert key={alert.id} alert={alert} onDismiss={() => setDismissed((current) => [...current, alert.id])} />) : <div className="orca-empty" data-testid="empty-alerts"><Check size={20} color="#1aa695" style={{ marginBottom: 8 }} /><div>{t('nothingElse')}</div></div>}</section>
      <aside className="orca-card orca-card-pad"><div className="orca-eyebrow">{t('alertGuidance')}</div><div className="orca-h2" style={{ margin: '6px 0 7px' }}>{t('readSignal')}</div><p className="orca-muted" style={{ fontSize: 11 }}>{t('alertGuidanceCopy')}</p><div style={{ marginTop: 17, display: 'flex', flexDirection: 'column', gap: 8 }}><div><FreshnessBadge status="LIVE" /><span style={{ marginLeft: 8, fontSize: 10, color: '#728a92' }}>{t('newlyObserved')}</span></div><div><FreshnessBadge status="CACHED" /><span style={{ marginLeft: 8, fontSize: 10, color: '#728a92' }}>{t('availableOffline')}</span></div><div><FreshnessBadge status="STALE" /><span style={{ marginLeft: 8, fontSize: 10, color: '#728a92' }}>{t('useCaution')}</span></div></div></aside>
    </div>
  </div>;
}

function FeedAlert({ alert, onDismiss }: { alert: typeof alerts[number]; onDismiss: () => void }) {
  const { t } = useLanguage();
  const Icon = alert.icon;
  const tone = alert.severity.toLowerCase();
  return <div className="orca-feed-item" data-testid={`alert-row-${alert.id}`}><div className={`orca-feed-severity ${tone}`}><Icon size={17} /></div><div><div className="orca-feed-title">{t(alert.titleKey)}</div><div className="orca-feed-copy">{t(alert.bodyKey)}</div><div style={{ marginTop: 7, color: '#8aa0a5', fontSize: 9 }}>{t(alert.sourceKey)}</div></div><div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}><span className="orca-feed-time">{alert.time}</span><button className="orca-icon-button" onClick={onDismiss} aria-label={`${t('alertsTitle')} ${t(alert.titleKey)}`} data-testid={`button-dismiss-${alert.id}`}><X size={13} /></button></div></div>;
}

function RoutePlanner() {
  const { t } = useLanguage();
  const [origin, setOrigin] = useState('Malpe Harbour');
  const [destination, setDestination] = useState('PFZ 04');
  const [departure, setDeparture] = useState('05:30');
  const [result, setResult] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setResult(true); };
  return <div>
    <DemoBanner />
    <div className="orca-page-head"><div><div className="orca-eyebrow">{t('routeEyebrow')}</div><h1 className="orca-h1">{t('routeTitle')}</h1><p className="orca-muted" style={{ margin: 0 }}>{t('routeDescription')}</p></div><div className="orca-statusline"><span className="orca-dot orca-dot-pulse" />{t('riskReady')}</div></div>
    <div className="orca-route-grid">
      <section className="orca-card orca-card-pad"><div className="orca-eyebrow">{t('buildTrip')}</div><div className="orca-h2" style={{ marginTop: 6, marginBottom: 19 }}>{t('heading')}</div><form className="orca-form" onSubmit={submit}><div className="orca-field"><label htmlFor="origin">{t('departurePoint')}</label><div style={{ position: 'relative' }}><Navigation size={14} color="#159b99" style={{ position: 'absolute', left: 12, top: 12 }} /><input id="origin" value={origin} onChange={(event) => setOrigin(event.target.value)} style={{ paddingLeft: 35 }} data-testid="input-route-origin" /></div></div><div className="orca-route-line"><span>{t('routeTo')}</span></div><div className="orca-field"><label htmlFor="destination">{t('destinationZone')}</label><div style={{ position: 'relative' }}><Anchor size={14} color="#159b99" style={{ position: 'absolute', left: 12, top: 12 }} /><input id="destination" value={destination} onChange={(event) => setDestination(event.target.value)} style={{ paddingLeft: 35 }} data-testid="input-route-destination" /></div></div><div className="orca-field-row"><div className="orca-field"><label htmlFor="departure">{t('leaveAt')}</label><input id="departure" type="time" value={departure} onChange={(event) => setDeparture(event.target.value)} data-testid="input-route-departure" /></div><div className="orca-field"><label htmlFor="duration">{t('duration')}</label><select id="duration" defaultValue="8 hours" data-testid="select-route-duration"><option>4 {t('hours')}</option><option>8 {t('hours')}</option><option>12 {t('hours')}</option></select></div></div><button className="orca-button orca-button-primary" type="submit" data-testid="button-check-route"><RouteIcon size={15} />{t('checkSafety')}</button></form></section>
      <section className="orca-card orca-card-pad" data-testid="card-route-result"><div className="orca-eyebrow">{t('routeResult')}</div>{result ? <><div className="orca-result-verdict" style={{ marginTop: 15 }}><div className="orca-result-word">{t('go')}</div><div className="orca-result-text">{t('routeSuitable')} {origin} {t('suitableIf')} {departure}. {t('returnBefore')}</div></div><div className="orca-route-stat"><div><strong>18.4</strong><span>{t('nauticalMiles')}</span></div><div><strong>0.8 m</strong><span>{t('peakWave')}</span></div><div><strong>16:00</strong><span>{t('returnBy')}</span></div></div><div style={{ marginTop: 18 }}><div className="orca-eyebrow">{t('whyRoute')}</div><div className="orca-trace"><div className="orca-trace-icon"><Check size={14} /></div><div><div className="orca-trace-name">{t('clearWindow')}</div><div className="orca-trace-note">{t('clearWindowCopy')}</div></div></div><div className="orca-trace"><div className="orca-trace-icon"><ShieldCheck size={14} /></div><div><div className="orca-trace-name">{t('boundaryChecked')}</div><div className="orca-trace-note">{t('boundaryCopy')}</div></div></div></div></> : <div className="orca-empty" style={{ paddingTop: 100, paddingBottom: 100 }}><RouteIcon size={27} color="#74bdbb" style={{ marginBottom: 9 }} /><div>{t('enterTrip')}</div><div style={{ fontSize: 10, marginTop: 5 }}>{t('sameEvidence')}</div></div>}</section>
    </div>
  </div>;
}

function About() {
  const { t } = useLanguage();
  return <div>
    <div className="orca-page-head"><div><div className="orca-eyebrow">{t('fieldGuide')}</div><h1 className="orca-h1">{t('clarity')}</h1><p className="orca-muted" style={{ margin: 0 }}>{t('fieldGuideCopy')}</p></div><div className="orca-mark" style={{ width: 46, height: 46, borderRadius: 14 }}><Fish size={24} /></div></div>
    <div className="orca-about-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">01 · {t('plainLanguage')}</div><h3>{t('orcaAnswers')}</h3><p>{t('plainLanguageCopy')}</p></section>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">02 · {t('verdicts')}</div><h3>{t('signedOutputs')}</h3><p>{t('verdictCopy')}</p><div style={{ display: 'flex', gap: 8, marginTop: 15, flexWrap: 'wrap' }}><span className="orca-status orca-status-live">{t('goSuitable')}</span><span className="orca-status orca-status-stale">{t('cautionPlan')}</span><span className="orca-status orca-status-unavailable">{t('noGoStay')}</span></div></section>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">03 · {t('signalDrops')}</div><h3>{t('offline')}</h3><p>{t('offlineCopy')}</p></section>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">{t('evidenceBrief')}</div><div style={{ marginTop: 9 }}><SourceRow icon={CloudLightning} titleKey="weatherLightning" sourceKey="imdInsat" freshness="LIVE" /><SourceRow icon={Waves} titleKey="oceanConditions" sourceKey="buoyWave" freshness="LIVE" /><SourceRow icon={Globe2} titleKey="satellitePfz" sourceKey="oceanColour" freshness="CACHED" /><SourceRow icon={ShieldCheck} titleKey="boundariesNotices" sourceKey="coastalAuthority" freshness="STALE" /></div></section>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">{t('aiRole')}</div><h3>{t('aiRoleTitle')}</h3><p>{t('aiRoleCopy')}</p><div style={{ marginTop: 16, display: 'flex', gap: 9, alignItems: 'flex-start', padding: 12, background: '#eff8f7', borderRadius: 10, color: '#42717a', fontSize: 10, lineHeight: 1.5 }}><Info size={15} color="#168d8c" style={{ flex: '0 0 auto' }} />{t('officialNote')}</div></section>
        <section className="orca-card orca-about-block"><div className="orca-eyebrow">{t('madeCoast')}</div><h3>{t('smallScreen')}</h3><p>{t('smallScreenCopy')}</p></section>
      </div>
    </div>
  </div>;
}

function SourceRow({ icon: Icon, titleKey, sourceKey, freshness }: { icon: typeof CloudLightning; titleKey: CopyKey; sourceKey: CopyKey; freshness: Freshness }) {
  const { t } = useLanguage();
  return <div className="orca-source-row" data-testid={`source-row-${titleKey}`}><Icon size={17} className="orca-source-icon" /><div className="orca-source-copy" style={{ flex: 1 }}><strong>{t(titleKey)}</strong><span>{t(sourceKey)}</span></div><FreshnessBadge status={freshness} /></div>;
}

function Router() {
  const [location] = useLocation();
  return <Shell><ErrorBoundary resetKey={location}><Switch><Route path="/" component={Overview} /><Route path="/assistant" component={Assistant} /><Route path="/map" component={MapWorkspace} /><Route path="/alerts" component={AlertsPage} /><Route path="/route" component={RoutePlanner} /><Route path="/about" component={About} /><Route component={NotFound} /></Switch></ErrorBoundary></Shell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;