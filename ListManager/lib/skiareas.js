/*  Week 4 - Quality Matters
 *  skiareas.js
 *  Peter Caliandro
 *  ITC 230, Spring 2018
 */

/*  This module creates and stores a makeshift, static database of ski areas
 *  and exposes methods for accessing and temporarily manipulating its information.
 *  Changes made using those methods will not be saved anywhere.
 */

const source =
`Shymbulak Mountain Resort	Zaiilisky Alatau	Kazakhstan	43	3200	2200	http://www.shymbulak.com/	https://en.wikipedia.org/wiki/Shymbulak
Afriski	Maluti Mountains	Lesotho	-29	3222	2917	https://www.afriski.net/	https://en.wikipedia.org/wiki/Afriski
Mt Olympus Ski Resort	Troodos Mountains	Cyprus	35	1930	1850	http://www.cyprusski.com/	http://www.snow-forecast.com/resorts/Mt-Olympus
Mzaar Kfardebian	Mount Lebanon Range	Lebanon	34	2465	1850	http://www.mzaarskiresort.co/mzaar/	https://en.wikipedia.org/wiki/Mzaar_Kfardebian
Tiffindell	Drakensberg	South Africa	-31	2900	2720	http://www.tiffindell.co.za/	https://en.wikipedia.org/wiki/Tiffindell_Ski_Resort
Khoshakoo	West Azerbaijan Province	Iran	37	2200	2000		https://skiofpersia.com/en/resort/khoshakoo/
Masikryong Ski Resort	Masikryong Range	North Korea	39	1360	768		https://en.wikipedia.org/wiki/Masikryong_Ski_Resort
Yabuli Ski Resort	Changbai Mountain Range	China	44	1345	397		https://www.chinahighlights.com/harbin/attraction/yabuli-skiing-center.htm
Tawang	Arunachal Pradesh	India	28		3048		https://www.tourism-of-india.com/skiing-in-tawang.html
Cerro Castor	Tierra del Fuego Province	Argentina	-55	1057		http://www.cerrocastor.com/	https://en.wikipedia.org/wiki/Cerro_Castor
Tsaghkadzor Ski Resort	Kotayk Province	Armenia	41	2820	1966	http://www.winterarmenia.com/skiinfo.php#mountain	https://en.wikipedia.org/wiki/Tsaghkadzor_ski_resort
Perisher Ski Resort	Snowy Mountains	Australia	-36	2054	1720	https://www.perisher.com.au/	https://en.wikipedia.org/wiki/Perisher_Ski_Resort
Oukaimeden	Atlas Mountains	Morocco	31	3200	2600		https://www.lonelyplanet.com/morocco/oukaimeden/activities/full-day-skiing-at-oukaimeden-resort-from-marrakech/a/pa-act/v-8248P23/1316544
Sisorarfiit - Nuuk	City of Nuuk	Greenland	64	400	10		https://www.tout-sur-google-earth.com/t20058-stations-de-ski-insolites-et-improbables
Chimgan	Tian Shan	Uzbekistan	41	3309			https://orexca.com/ski_tours_chimgan.shtml
Monterreal	Sierra Madre Oriental	Mexico	25	3445	2940		http://www.monterreal.com/
Zavjalikha	Ural Mountains	Russia	55	840	414	https://zavjalikha.net/	https://www.onthesnow.com/russia/ski-resorts.html
Solnechnaya Dolina Mountain Ski Center	City of Minsk	Belarus	54		281	https://yesbelarus.com/activities/skiing-skating/solnechnaya-dolina-mountain-ski-center/	http://www.skiingaroundtheworldbook.com/skiing-belarus/
Cloudmont Ski & Golf Resort	Southern Appalachians	United States	35	549	503	http://www.cloudmont.com/	https://www.circlesquarediamond.com/blogs/news/91670214-10-unique-ski-resorts-you-ve-likely-never-heard-of
Sky Resort	Bogd Khan Mountain	Mongolia	48	1570	1379	http://www.skyresort.mn/pages/%D0%B1%D0%B0%D0%B0%D0%B7%D1%8B%D0%BD-%D1%82%D0%B0%D0%BD%D0%B8%D0%BB%D1%86%D1%83%D1%83%D0%BB%D0%B3%D0%B0	`;
//  This source string serves as the raw data from which to create a makeshift, static database.
//  Note that this source string contains newlines ("\n") and tabs ("\t").
//  (It was simply copied from an Excel worksheet left over from a previous web development school project.)


let skiArea = (  //  This function creates a SkiArea object from a set of parameters.
        name,  //  name is the only required parameter.  It will also be used later on as a unique key in the skiAreas array.
        region = "",
        country = "",
        latitude = NaN,  //  We're using NaN here as a numeric empty-string equivalent,
        top = NaN,  //  as the value of 0 has a numeric meaning that would be inaccurate
        base = NaN,  //  and misleading in this context.
        website = "",
        article = ""
    ) => {
    return {
        Name         : name,
        SearchString : encodeURIComponent(name),
        Region       : region,
        Country      : country,
        Latitude     : latitude,
        Top          : top,
        Base         : base,
        Website      : website,
        Article      : article
    };
};


//  This function creates an array of skiArea objects to serve as a makeshift database.
//  It gets its data from the source string defined above.
//  
//  Split the source string by the newline character to create an array of rows.
//  Then split each row by the tab character to create an array of columns.
//  Then create a skiArea object from each row by assigning each column to its own field.
let skiAreas = source.split("\n").map(row => {
    let columns = row.split("\t");
    return skiArea(
                 columns[0] ,
                 columns[1] ,
                 columns[2] ,
        parseInt(columns[3]),
        parseInt(columns[4]),
        parseInt(columns[5]),
                 columns[6] ,
                 columns[7]
    );
});


exports.getAll  =  () => {  //  Return the entire skiAreas array, sorted by name.
    return skiAreas.sort((first, second) =>
        first.Name.localeCompare(second.Name)
    );
};


exports.get  =  (name) => {  //  Return one skiArea object.  Search for it by name.
    if (!name) {  //  In case an empty string is passed as a parameter . . .
        return undefined;  //  A return value of undefined means that no skiArea was found.
    }

    name = name.toLowerCase();  //  to enable case-insensitive searching
    return skiAreas.find(skiArea =>
        skiArea.Name.toLowerCase() === name  //  Returns undefined if name is not found.
    );
};


exports.delete  =  (name) => {  //  It is assumed that name will be a string.
    if (!name) {  //  In case an empty string is passed . . .
        return undefined;  //  A return value of undefined means that no skiArea was found.
    }

    name = name.toLowerCase();  //  to enable case-insensitive searching
    let index = skiAreas.findIndex(skiArea =>
        skiArea.Name.toLowerCase() === name
    );
    if (index === -1) {  //  Not found; return a value to indicate that.
        return undefined;
    } else {  //  Found.  Delete the object from the array.  Return that object to the caller.
        return skiAreas.splice(index, 1)[0];
    }
};


//  If it is not already in the skiAreas array, create a new skiArea from the given parameter, and add it to skiAreas.
//  Return the new skiArea object -- but if a ski area with the same name is already in skiAreas, then don't create any new object; instead, return undefined.
exports.add  =  (skiAreaInput) => {
    if (exports.get(skiAreaInput.name)) {  //  then a ski area with the name name is already in the skiAreas array.
        return undefined;  //  to indicate that we will not be adding this ski area a second time.
    }
    
    let newSkiArea = skiArea(
        skiAreaInput.name,
        skiAreaInput.region,
        skiAreaInput.country,
        parseInt(skiAreaInput.latitude),
        parseInt(skiAreaInput.top),
        parseInt(skiAreaInput.base),
        skiAreaInput.website,
        skiAreaInput.article
    );
    skiAreas.push(newSkiArea);

    return newSkiArea;  //  to confirm that this new skiArea has been added to the skiAreas array.
};
