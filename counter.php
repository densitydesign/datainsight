<?php
	
	$json = file_get_contents("data/biology_500.json");
	
	$json = json_decode($json);
	
	$all_discipline = array();
	
	foreach($json as $object) {
		
		//	print_r($object->stats);
		$readers =  $object->stats->readers;
		$disciplines = $object->stats->discipline;
		
		foreach ($disciplines as $d) {
			
			//echo $d->name." ".($d->value/100*$readers)." ".$readers."</br>";
			
			$real_value = round($d->value/100*$readers);
			
			if (isset($all_discipline[$d->name]))
				$all_discipline[$d->name] += $real_value;
			else $all_discipline[$d->name] = $real_value;
			
		}
		
	}
	
	print_r($all_discipline);

?>