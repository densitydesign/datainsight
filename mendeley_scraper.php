<?php
	
	// Mendeley API
	$api = "78b7b4b2e39d722c1aa89f149ed9311a04e058de1";
	// URL for documents search
	$url = "http://api.mendeley.com/oapi/documents/details/";
	
	$file_r = "data/biology.csv";
	$file_w = "data/biology_more.csv";
	
	if (($handle = fopen($file_r, "r")) !== FALSE) {

			$rows = array();
			$header = fgetcsv($handle, 1000, ",");

			$header = explode(",",$header[0]);
			
		    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		       	$c=0;
				$row = array();

				foreach ($header as $key) {
		            $row = utf8_decode(str_replace('"',"'",$data[$c]));
		        	$c++;
				}
		   	$rows[] = $row;
		 	}
		    fclose($handle);
		}

		
		$all = array();
		
		for ($i=0; $i<500; $i++) {
			
			$result = file_get_contents($url.$rows[$i]."/?consumer_key=".$api);
			$all[$rows[$i]] = json_decode($result);		
		}
		
		print_r(json_encode($all));
		
	
	
?>