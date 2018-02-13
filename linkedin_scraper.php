<?php

include_once("simple_html_dom.php");

function convertXmlObjToArr($obj, &$arr) 
{ 
	$children = $obj->children(); 
	foreach ($children as $elementName => $node) 
	{ 
		$nextIdx = count($arr); 
		$arr[$nextIdx] = array(); 
		$arr[$nextIdx]['@name'] = strtolower((string)$elementName); 
		$arr[$nextIdx]['@attributes'] = array(); 
		$attributes = $node->attributes(); 
		foreach ($attributes as $attributeName => $attributeValue) 
		{ 
			$attribName = strtolower(trim((string)$attributeName)); 
			$attribVal = trim((string)$attributeValue); 
			$arr[$nextIdx]['@attributes'][$attribName] = $attribVal; 
		} 
		$text = (string)$node; 
		$text = trim($text); 
		if (strlen($text) > 0) 
		{ 
			$arr[$nextIdx]['@text'] = $text; 
		} 
		$arr[$nextIdx]['@children'] = array(); 
		convertXmlObjToArr($node, $arr[$nextIdx]['@children']); 
	} 
	return; 
}

$json = file_get_contents("data/names.json");

$json = json_decode($json);

$persons = array();


	$file_r = "data/industries.csv";
	
	if (($handle = fopen($file_r, "r")) !== FALSE) {

			$industries = array();
			
		    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
				
		   		$industries[] = $data[0];
		 	}
		    fclose($handle);
		}


foreach($json as $object) {

	$forename =  $object->forename;
	$surname =  $object->surname;
	$readers =  $object->readers;

	$valid = true;


	if( !strlen($forename) < 2 ) {

		$pieces = explode(" ",$forename);

		foreach ($pieces as $piece) {
			if (strlen($piece) == 1)
				$valid = false;
		}

		} else $valid = false;


		if( $valid ) {
			
			//echo "<p>Looking for ".$forename." ".$surname." on Linkedin...</p>";
			
			$doc = file_get_html("http://www.linkedin.com/pub/dir/".$forename."/".$surname);		
		
			foreach($doc->find("ol#result-set") as $ol) {
				
				$person_data = array();
				
				foreach($ol->find("li.vcard") as $il) {
				
				foreach($il->find("dd.title") as $title)
					$person_data["title"] = trim($title->innertext);
				
				foreach($il->find("span.industry") as $industry)
					$person_data["industry"] = trim($industry->innertext);
				
				foreach($il->find("a") as $link)
					$person_data["link"] = trim($link->href);
					
				$person_data["forename"] = $forename;
				$person_data["surname"] = $surname;
				$person_data["readers"] = $readers;
				
									
				if( in_array($person_data["industry"], $industries) ) {
					
					$page = file_get_html($person_data["link"]);

					foreach($page->find("dd.overview-connections") as $conn)
						foreach($conn->find("strong") as $connections)
							$person_data["li"][] = $connections->innertext;
					
					if(!isset($persons[$forename." ".$surname]))
						$persons[$forename." ".$surname] = $person_data;
					else {
						
						$persons[$forename." ".$surname]["li"][] = $connections->innertext;	
					}
										
					} 
				
				}
				
			}

		}

	//	sleep(.5);
		
		

	}

	$persons = array_values($persons);
	print_r(json_encode($persons));



	?>