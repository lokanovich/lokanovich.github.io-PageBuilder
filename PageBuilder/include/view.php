<?php
	if (SUPRA !== 1) die();

	/*
	 * @autor: MultiFour
	 * @version: 1.0.0
	 *
	 * Class View
	 */
	class View {

		public function __construct() {
			include_once 'include/controllers/html.php';
			new Html();
		}
	}
