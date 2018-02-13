<?php
	
	$json = file_get_contents("data/biology_500.json");
	
	$json = json_decode($json);
	$names = array();
	
	foreach($json as $object) {
		
		$authors =  $object->authors;
		
		foreach ($authors as $a) {
			
			$name["forename"] = $a->forename;
			$name["surname"] = $a->surname;
			$name["readers"] = $object->stats->readers;
			
			if(isset($names[$a->forename." ".$a->surname]))
				$names[$a->forename." ".$a->surname]["readers"] += $name["readers"];
			else $names[$a->forename." ".$a->surname] = $name;
		}
		
	}
	
	$names = array_values($names);
	print_r(json_encode($names));

//	print_r($names);

?>