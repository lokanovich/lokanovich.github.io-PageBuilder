<?php
	if (SUPRA !== 1) die('not way!');
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="pragma" content="no-cache">
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
	<title>Supra Pagebuilder</title>

	<link rel="icon" href="images/favicons/favicon.png" type="image/x-icon"/>
	<link rel="apple-touch-icon" href="images/favicons/apple-touch-icon.png">
	<link rel="apple-touch-icon" sizes="72x72" href="images/favicons/apple-touch-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="114x114" href="images/favicons/apple-touch-icon-114x114.png">

	<link rel="stylesheet" href="css/bootstrap.css" />
	<link rel="stylesheet" href="css/spectrum.css" />
	<link rel="stylesheet" href="css/owl.carousel.css" />
	<link rel="stylesheet" href="css/magnific-popup.css" />
	<link rel="stylesheet" href="css/aos.css" />
	<link rel="stylesheet" href="css/style.css" />
	<link rel="stylesheet" href="css/main.css" />
	<link rel="stylesheet" href="css/supra_icons.css" />
	<link rel="stylesheet" href="css/icons.css" />
	<link rel="stylesheet" href="css/preloader.css" />
<!--	<link rel="stylesheet" href="css/fonts.css" />-->
	<script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
	<script src="js/fonts.js"></script>
</head>
<body>
<script src="js/jquery-2.1.4.min.js"></script>
<script src="js/owl.carousel.js"></script>
<div class="supra-preloader">
	<img src="images/logo.png" srcset="images/logo@2x.png 2x" alt="suprapagebuilder"/>
	<div class="progress-bar-s">
		<div class="progress"><div class="load"></div></div>
	</div>
	<div class="rights">
		<p>&#169; 2017 <a href="http://multifour.com/" target="_blank">Multifour.com</a></p>
		<p>Version 2.5</p>
	</div>
</div>
<aside class="left supra black">
	<nav>
		<ul class="checking">
			<li id="sections" class="item-check"><i class="supra icon-plus-square"></i></li>
			<li id="default-styles" class="item-check"><i class="supra icon-edit-mode"></i></li>
			<li id="typography" class="item-check"><i class="supra icon-typography"></i></li>
			<li id="project-pages" class="item-check"><i class="supra icon-file-check"></i></li>
			<li id="redo" class="redo unactive"><i class="supra icon-redo"></i></li>
			<li id="undo" class="undo unactive"><i class="supra icon-undo"></i></li>
		</ul>
	</nav>
</aside>
<aside class="add-sections-items supra black">
	<ul>
		<?php
			foreach ($this->groups as $group_name => $items) {
				foreach ($items['sections'] as $id => $value) {
					echo '
					<li class="wrap-hover flex-center"
						data-group="' . $group_name . '"
						data-name="' . $value->name . '"
						data-id="' . $id . '"
						style="display: none;">
						<img src="' . $value->preview . '" />
						<i class="supra icon-plus add-section"></i>
					</li>

				';
				}
			}
		?>
	</ul>
</aside>
<aside class="control-panel supra black">
	<div class="title">
		<h3>Section</h3>
		<i class="supra bookmark"></i>
	</div>
	<ul class="sections">
		<?php
			foreach ($this->groups as $group_name => $value) {
				echo "<li>"
				     .ucfirst($group_name).
				     "</li>";
			}
		?>
	</ul>
	<div class="default-styles">
		<div class="btn-group" role="group" aria-label="...">
			<button data-id="light" type="button" class="supra-btn btn-default active">Light</button>
			<button data-id="dark" type="button" class="supra-btn btn-default">Dark</button>
		</div>
		<div class="message">
			<i class="supra icon-cross2"></i>
			<p>
				Lorem ipsum dolor sit amet,
				consectetur adipisicing elit.
				Alias assumenda consectetur
				consequatur cum debitis deserunt
				dolor doloribus eaque error,
				odio perferendis placeat possimus,
				quae sapiente sed sunt suscipit temporibus ullam!
			</p>
		</div>
		<ul id="dark"></ul>
		<ul id="light" class="active"></ul>
		<button type="button" class="supra-btn apply btn-primary">Apply</button>
	</div>
	<ul class="typography">
		<?php
			$fontsDropdown = '';
			foreach ($this->fontsDropdown as $font) {
				$light = '';
				if ((int) $font['font_weight'] < 400 && (int) $font['font_weight'] > 200) {
					$light = ' light';
				} elseif ((int) $font['font_weight'] < 201 && (int) $font['font_weight'] > 100) {
					$light = ' extra-light';
				} elseif ((int) $font['font_weight'] < 101) {
					$light = ' thin';
				}
				$fontsDropdown .= '<li><a href="#" data-weight="'
				                        .$font['font_weight'].'" data-value="'
				                        .$font['font_family'].'" style="font-family: \''
				                  .$font['font_family'].'\'; font-weight: '
				                  .$font['font_weight'].';">'
				                    .$font['font_family'].$light
				                  .'</a></li>
						';
			}

			$args = array(
				array(
					'title' => 'Text font'
				, 'id' => 'text-font-dropdown'
				, 'style_element' => ''
				)
			, array(
					'title' => 'H1'
				, 'id' => 'h1-font-dropdown'
				, 'style_element' => 'h1'
				)
			, array(
					'title' => 'H2'
				, 'id' => 'h2-font-dropdown'
				, 'style_element' => 'h2'
				)
			, array(
					'title' => 'H3'
				, 'id' => 'h3-font-dropdown'
				, 'style_element' => 'h3'
				)
			, array(
					'title' => 'H4'
				, 'id' => 'h4-font-dropdown'
				, 'style_element' => 'h4'
				)
			);

			foreach ($args as $item) {
				echo '<li>
					<div class="item">
						<label>'.$item["title"].'</label>
						<div class="dropdown">
							<button class="supra-btn btn-default dropdown-toggle"
							type="button"
							id="'.$item["id"].'"
							data-element="'.$item["style_element"].'"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false">
								<span>Helvetica Neue</span>
								<i class="supra icon-chevron-down-small"></i>
							</button>
							<ul class="dropdown-menu test-font" aria-labelledby="'.$item["id"].'">
								'.$fontsDropdown.'
							</ul>
						</div>
						<div class="text-style">
							<input type="text" placeholder="199px">
							<div class="btn-group" role="group" aria-label="...">
								<button type="button" data-style="bold" class="supra-btn btn-style-text bold">
									<i class="supra icon-bold"></i>
								</button>
								<button type="button" data-style="italic" class="supra-btn btn-style-text italic">
									<i class="supra icon-italic"></i>
								</button>
								<button type="button" data-style="uppercase" class="supra-btn btn-style-text uppercase">
									<i class="supra icon-text-size"></i>
								</button>
							</div>
						</div>
					</div>
				</li>';
			}

		?>
		<li><button type="button" class="supra-btn btn-primary apply">Apply</button></li>
	</ul>
	<div class="project-pages">
		<ul>
			<li>
				<i class="supra icon-file-add"></i>
				<span>Add new page</span>
			</li>
		</ul>
		<div class="btn-ex-im-d">
			<div type="button" class="supra-btn new-project">
				<i class="supra icon-folder-plus"></i>
				<span>New</span>
			</div>
			<div type="button" class="supra-btn export">
				<i class="supra icon-folder-download"></i>
                <span>Save</span>
			</div>
			<div type="button" class="supra-btn import">
				<i class="supra icon-folder-upload"></i>
                <span>Load</span>
			</div>
			<div type="button" class="supra-btn btn-success download" data-href="http://google.com.ua">
				<i class="supra icon-file-zip"></i>
				<span>Download</span>
			</div>
		</div>
	</div>
</aside>
<div class="main font-style-supra">
	<style></style>
</div>

<div id="modal-container" class="supra"></div>
<div id="modal-project-container" class="supra"></div>
<div id="modal-form-container" class="supra font-style-supra"></div>

<script>
	<?php
	echo "sectionsPreview=".json_encode($this->groups)."\n";
	?>
</script>
<!-- Latest 3.2.x goodshare.js minify version from jsDelivr CDN -->
<script src="https://cdn.jsdelivr.net/jquery.goodshare.js/3.2.8/goodshare.min.js"></script>
<script src="js/jquery.magnific-popup.min.js"></script>
<script src="js/jquery.smooth-scroll.min.js"></script>
<script src="js/jquery.validate.min.js"></script>
<script src="js/jquery.nicescroll.min.js"></script>
<script src="js/jquery.mask.js"></script>
<script src="js/jquery.vide_builder.min.js"></script>
<script src="js/aos.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCByts0vn5uAYat3aXEeK0yWL7txqfSMX8"></script>

<script src="js/bootstrap.min.js"></script>
<script src="js/spectrum.js"></script>
<script src="js/skrollr.js"></script>

<script src="js/download.js"></script>
<script src="js/options.js"></script>
<script src="js/editor.text.js"></script>
<script src="js/modal.js"></script>
<script src="js/controls.js"></script>
<script src="js/page.js"></script>
<script src="js/suprabuilder.js"></script>
<script src="js/supra-main.js"></script>
<!--<script src="js/builder.min.js"></script>-->
</body>
</html>