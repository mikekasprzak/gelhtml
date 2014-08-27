<?php
	$shm_key = 0x31337;//ftok(__FILE__, 't');
	echo $shm_key;
//	echo $shm_key;
	$shid = shmop_open($shm_key,"a",0644,1024);
	if ( !empty($shid) ) {
		echo "EXISTS!";
	} else {
		echo "DOES NOT EXIST!";
		$shid = shmop_open($shm_key,"c",0644,1024);
	}
	
	shmop_close($shid);
?>
