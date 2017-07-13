<?php
	/*
	 * @autor: MultiFour
	 * @version: 1.0.0
	 *
	 * Class Request
	 */
	class Request {
		protected $_base_path = null;
		protected $_images = array();
		protected $_videos = array();
		protected $_file_error = '';

		public function __construct() {
			$this->_base_path = SUPRA_BASE_PATH;
		}

		/**
		 * @param $haystack {array|string}
		 * @param $needles {array}
		 * @param $offset {int}
		 * @return bool|int
		 */
		protected function _strposa($haystack, $needles, $offset = 0) {
			if (is_array($needles)) {
				foreach ($needles as $needle) {
					$pos = $this->_strposa($haystack, $needle);
					if ($pos !== false) {
						return $pos;
					}
				}
				return false;
			} else {
				return strpos($haystack, $needles, $offset);
			}
		}

		/**
		 * @param $val {variable}
		 * @param $type {string}
		 * @return bool|int
		 */
		protected function _validation(&$val, $type) {
			switch ($type) {
				case 'string':
					return preg_match('/^[0-9a-zа-яё.()@_ -]*$/i', $val);
					break;
				case 'email':
					$arr = explode(',', $val);
					$result = array();
					if (is_array($arr)) {
						foreach($arr as $value) {
							if (preg_match('/^[a-z0-9._-]+[^.]+@[^@]+[a-z_-]+\.[a-z]+$/i', trim($value)))
								array_push($result, $value);
						}
						$val = implode(',', $result);
						return true;
					} else {
						return preg_match( '/^[a-z0-9._-]+[^.]+@[^@]+[a-z_-]+\.[a-z]+$/i', $val );
					}
					break;
				case 'file':
					if ($val['error'] > 0) {
						$this->_check_file_error($val['error']);
						return false;
					}
					return true;
			}

			return false;
		}

		/**
		 * @param $error {int}
		 */
		protected function _check_file_error($error) {
			switch ($error) {
				case 1:
				case 2:
					$max_file_size = ini_get('upload_max_filesize');
					$this->_file_error = 'The uploaded file exceeds the max filesize (' . $max_file_size . ')';
					break;
				case 3:
					$this->_file_error = 'The uploaded file was only partially uploaded';
					break;
				case 4:
					$this->_file_error = 'No file was uploaded';
					break;
				case 6:
					$this->_file_error = 'Missing a temporary folder';
					break;
				case 7:
					$this->_file_error = 'Failed to write file to disk';
					break;
				case 8:
				default:
					$this->_file_error = 'Error upload file';
					break;
			}
		}

		/**
		 * @param $path {string}
		 * @param $arr {array}
		 * @param $mode {string}
		 */
		protected function _upload_file($path, $arr, $mode) {
			$file_name = $_POST['name_file'];
			if ($this->_validation($file_name, 'string')) {
				if ( $this->_strposa( strtolower($file_name), $arr ) ) {
					if ($this->_validation($_FILES['data'], 'file')) {
						if ( move_uploaded_file( $_FILES['data']['tmp_name'],
							$path . $file_name ) ) {

							if ($mode === 'addgallery') {
								echo json_encode( array( 'fileName' => '/images/gallery/' . $file_name ) );
							} else if ($mode === 'addgalleryvideo') {
								echo json_encode( array( 'fileName' => '/video/gallery/' . $file_name ) );
							} else if ($mode === 'import') {
								$zip = new ZipArchive();
								$file_name = 'tmp/' . $file_name;
								if (preg_match('/.*\.zip/i', $file_name)) {
									if ( $zip->open( $file_name ) ) {
										$zip->extractTo( 'tmp/' );
										$zip->close();
										unlink( $file_name );

										$this->_readFileProject('tmp/project.supra');
									}
								} else if (preg_match('/.*\.supra/i', $file_name)) {
									$this->_readFileProject($file_name);
									unlink( $file_name );
								}
							}

							exit();
						} else {
							echo json_encode( array( 'error' => 'file not was uploaded' ) );
							exit();
						}
					} else {
						echo json_encode( array( 'error' => $this->_file_error ) );
						exit();
					}
				}
			} else {
				echo json_encode(array('error' => 'this file name invalid'));
				exit();
			}
			echo json_encode(array('error' => 'this extension file not supported'));
			exit();
		}

		/**
		 * @param $f_name_project {string}
		 */
		protected function _readFileProject($f_name_project) {
			$file_project   = fopen( $f_name_project, 'r' );
			if ( $file_project ) {
				$f_size  = filesize( $f_name_project );
				$content = fread( $file_project, $f_size );

				fclose( $file_project );
				unlink( $f_name_project );

				echo $content;
				exit();
			}
		}

		/**
		 * Calling from ajax to add the gallery new an image
		 */
		public function Addgallery() {
			$this->_upload_file($this->_base_path .'/images/gallery/', array( '.png', '.jpg', '.jpeg', '.gif', '.svg' ), 'addgallery');
		}

		/**
		 * Calling from ajax to add the gallery new an image
		 */
		public function Addgalleryvideo() {
			$this->_upload_file($this->_base_path .'/video/gallery/', array( '.mp4', '.ogv', '.jpg' ), 'addgalleryvideo');
		}

        /**
		 * Calling from ajax to get the images collection
		 */
		public function Getgallery() {
			$type = $_POST['type'];
			$base_path = $this->_base_path.'/images/gallery';

			$this->_images = scandir($base_path);
			unset($this->_images[0]);
			unset($this->_images[1]);

			$response = array();
			foreach ($this->_images as $image) {
				if (is_file($base_path. '/' .$image)) {
					if ($type === 'retina' && preg_match('/@2x/', $image)) {
						$size       = getimagesize( $base_path . '/' . $image );
						$response[] = array(
							'name'   => $image . '?t=' . time()
						,	'width'  => $size[0]
						,	'height' => $size[1]
						);
					} else if ($type === 'normal' && !preg_match('/@2x/', $image)) {
						$size       = getimagesize( $base_path . '/' . $image );
						$srcset = '';
						if (preg_match('/([^.]*)(\..*)/', $image, $match)) {
							$srcset = $match[1] . '@2x' . $match[2];
							if (!is_file($base_path. '/' .$srcset))
								$srcset = '';
						}
						$response[] = array(
							'name'   => $image . '?t=' . time()
						,   'srcset' => $srcset
						,	'width'  => $size[0]
						,	'height' => $size[1]
						);
					} else if ($type === 'normal' && preg_match('/\.svg/', $image)) {
						$response[] = array(
							'name'   => $image . '?t=' . time()
						);
					}
				}
			}

			echo json_encode(array('gallery' => $response));
			exit();
		}
        
        /**
		 * Calling from ajax to get the video collection
		 */
        public function Getgalleryvideo() {
			$base_path = $this->_base_path.'/video/gallery';
            $mode = ini_get('magic_quotes_gpc');
			$data = $_POST['data'];
            if ($mode) {
				$data = stripslashes($data);
			}

			$this->_videos = scandir($base_path);
			unset($this->_videos[0]);
			unset($this->_videos[1]);

			$response = array();
			foreach ($this->_videos as $video) {
				if (is_file($base_path. '/' .$video)
					&& $this->_strposa( strtolower($video), array('.' . $data) )
					&& $data !== 'jpg'
				) {
					preg_match('/[^.]*/i', $video, $poster);
					$size = null;
					if (is_file($base_path. '/' . $poster[0]. '.jpg'))
						$size = getimagesize($base_path. '/' . $poster[0]. '.jpg');
					$response[] = array('name' => $video
						, 'width' => $size ? $size[0] : ''
						, 'height' => $size ? $size[1] : ''
					);
				} else if($this->_strposa( strtolower($video), array('.' . $data))) {
					$size = getimagesize($base_path. '/' .$video);
					$response[] = array('name' => $video
					, 'width' => $size[0]
					, 'height' => $size[1]
					);
				}
			}

			echo json_encode(array('gallery' => $response));
			exit();
		}

		/**
		 * Calling from ajax to get the icons collection
		 */
		public function Geticonsgallery() {
			$base_path = 'css/icons.css';

			$css_icons = file_get_contents($base_path);

			$match = preg_match_all('/\.icon-[^:]*/im', $css_icons, $response);

			if ($match) {
				echo json_encode(array('iconsGallery' => $response));
				exit();
			}
			echo json_encode(array('error' => 'Icons not exist'));
			exit();
		}

		/**
		 * Calling from ajax to get a file that contains intermediate work of the project
		 */
		public function Export() {
			$this->_clearTmp();
			$mode = ini_get('magic_quotes_gpc');
			$data = $_POST['data'];
			if ($mode) {
				$data = stripslashes($data);
			}

			$filename = "tmp/" . uniqid() . "_project.zip";
			$zip = new ZipArchive();
			$zip->open($filename, ZipArchive::CREATE);

			$zip->addFromString('project.supra',$data);

			$zip->close();

			$file_name = basename($filename);

			echo json_encode(array('file' => $file_name));
			exit();
		}

		/**
		 * Calling from ajax to upload a file that contains intermediate work of the project
		 */
		public function Import() {
			$this->_upload_file($this->_base_path .'/tmp/', array( '.zip', '.supra' ), 'import');
		}

		/**
		 * @param $baseFiles {array}
		 * @param $js_plugins {string}
		 */
		protected function _add_video_bg(&$baseFiles, &$js_plugins) {
			array_push($baseFiles['js'], 'jquery.vide.min.js');
//			$baseFiles = array_merge($baseFiles, array(
//					'video' => array(
//						'video_bg.mp4'
//					, 'video_bg.ogv'
//					, 'video_bg.jpg'
//					)
//				)
//			);
		}

		/**
		 * @param $baseFiles {array}
		 * @param $js_plugins {string}
		 * @param $style_gallery {string}
		 */
		protected function _add_gallery(&$baseFiles, &$js_plugins, &$style_gallery) {
			array_push($baseFiles['css'], 'owl.carousel.css');
			array_push($baseFiles['js'], 'owl.carousel.js');
		}

		/**
		 * @param $baseFiles {array}
		 * @param $js_plugins {string}
		 * @param $style_magnific {string}
		 */
		protected function _add_magnific(&$baseFiles, &$js_plugins, &$style_magnific) {
			array_push($baseFiles['css'], 'magnific-popup.css');
			array_push($baseFiles['js'], 'jquery.magnific-popup.min.js');
		}

		/**
		 * @param $baseFiles {array}
		 * @param $data {object}
		 * @param $zip {object}
		 * @param $js_plugins {string}
		 */
		protected function _add_form_section(&$baseFiles, &$data, &$zip, &$js_plugins) {
			array_push($baseFiles['js'], 'jquery.validate.min.js');

			$path = 'scripts/request.php';
			$content = file_get_contents($path);

			foreach ($data->forms as $form) {
				if ($form->settings->type === 'subscribe') {
					$api_key = $this->_validation( $form->settings->apiKey,
						'string' ) ? $form->settings->apiKey : '';
					$list_id   = $this->_validation( $form->settings->listId, 'string' ) ? $form->settings->listId : '';
					$id      = $this->_validation( $form->settings->id, 'string' ) ? $form->settings->id : '';

					$datacenter = explode('-', $api_key);
					$content .= '
if($_POST[\'id\'] === "' . $id . '") {
	$apiKey = \''.$api_key.'\'; // your mailchimp API KEY here
	$listId = \''.$list_id.'\'; // your mailchimp LIST ID here
	$double_optin=false;
	$send_welcome=false;
	$email_type = \'html\';
	$email = $_POST[\'newsletter_email\'];
	$submit_url = "http://'.$datacenter[1].'.api.mailchimp.com/1.3/?method=listSubscribe"; //replace us2 with your actual datacenter
	$data = array(
		\'email_address\'=>$email,
		\'apikey\'=>$apiKey,
		\'id\' => $listId,
		\'double_optin\' => $double_optin,
		\'send_welcome\' => $send_welcome,
		\'email_type\' => $email_type
	);
	$payload = json_encode($data);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $submit_url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, urlencode($payload));

	$result = curl_exec($ch);
	curl_close ($ch);
	$data = json_decode($result);
	if ($data->error){
		echo $data->error;
	} else {
		echo \'Got it, you\\\'ve been added to our email list.\';
	}
}
';

				} else {
					$subject = $this->_validation( $form->settings->subject,
						'string' ) ? $form->settings->subject : '';
					$email   = $this->_validation( $form->settings->email, 'email' ) ? $form->settings->email : '';
					$id      = $this->_validation( $form->settings->id, 'string' ) ? $form->settings->id : '';

					$content .= '
if($_POST[\'id\'] === "' . $id . '") {
	$to = "' . $email . '"; // Your e-mail address here.
	$body = "\\nName: {$_POST[\'contactname\']}\\nEmail: {$_POST[\'contactemail\']}\\n\\n\\n{$_POST[\'contactmessage\']}\\n\\n";
	mail($to, "' . $subject . '", $body, "From: {$_POST[\'contactemail\']}"); // E-Mail subject here.
}
';
				}
			}

			$zip->addFromString(
				$path
				, $content
			);
		}

		/**
		 * @param $baseFiles {array}
		 * @param $js_plugins {string}
		 */
		protected function _add_smooth(&$baseFiles, &$js_plugins) {
			array_push($baseFiles['js'], 'jquery.smooth-scroll.min.js');
		}

		/**
		 * @param $baseFiles {array}
		 * @param $js_plugins {string}
		 */
		protected function _add_parallax(&$baseFiles, &$js_plugins) {
			array_push($baseFiles['js'], 'skrollr.js');
		}

		/**
		 * @param $data {object}
		 * @param $zip {object}
		 * @param $fonts {string}
		 */
		protected function _add_fonts(&$data, &$zip, &$fonts) {
			$fonts_path = 'js/fonts.js';
			$content = '';
			$fonts_content = file_get_contents($fonts_path);
			foreach ($data->fonts_project as $value) {
				$font_name = str_replace(' ', '\+', $value);
				preg_match('/[^:]*/i',$font_name, $font_name_two);
				preg_match_all('/.*(?:'.$font_name.'|'.$font_name_two[0].'(?!\:)).*/i', $fonts_content, $fonts_fdg);
				$content .= $fonts_fdg[0][0]."\n";
			}
			$content = "\"use strict\";\n\nWebFont.load({
    google: {
        families: [
".$content."        ]
    }
});";
			$zip->addFromString( 'js/fonts.js', $content);
			$fonts .= "\n\t\t<script src=\"http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js\"></script>";
			$fonts .= "\n\t\t<script src=\"js/fonts.js\"></script>";
		}
		/**
		 * @param $baseFiles {array}
		 * @param $js_plugins {string}
		 * @param $style_magnific {string}
		 */
		protected function _add_aos(&$baseFiles, &$js_plugins) {
			array_push($baseFiles['css'], 'aos.css');
			array_push($baseFiles['js'], 'aos.js');
		}

		/**
		 * @param $data {object}
		 * @param $overall_js {string}
		 * @param $zip {object}
		 * @param $fonts {string}
		 * @param $default_css {string}
		 * @param $style_gallery {string}
		 * @param $style_magnific {string}
		 * @param $default_js {string}
		 * @param $js_plugins {string}
		 */
		protected function _add_page(&$data, &$overall_js, &$zip, &$fonts, &$default_css, &$style_gallery,
			&$style_magnific, &$default_js, &$js_plugins) {
			$uniqueJs = array();
			foreach ($data->pages as $page) {
				foreach($page->sections as $group_name => $sections) {
					if (file_exists('sections/' . $group_name . '/overall.js')
					    && !in_array($group_name, $uniqueJs)
					) {
						$overall_js .= file_get_contents('sections/' . $group_name . '/overall.js')."\n";
						array_push($uniqueJs, $group_name);
					}
					foreach($sections as $section) {
						$images  = scandir( 'sections/' . $group_name . '/' . $section . '/images' );
						unset( $images[0] );
						unset( $images[1] );
						foreach ( $images as $image ) {
							preg_match( "/^([^.]*)./i", $image, $res );
							if ( $res[1] !== $section ) {
								$zip->addFile(
									'sections/' . $group_name . '/' . $section . '/images/' . $image
									, 'images/' . $image
								);
							}
						}
					}
				}

				$includePajeStyle = '';
				if ($page->style !== '') {
                    $page_style = preg_replace('#\?t=[0-9]*#im', '', $page->style);
                    
					preg_match_all('#(/)?images/gallery/([^"\')]*)#i', $page_style, $customImages);
					if (!empty($customImages[2]) && count($customImages[2]) > 0) {
						foreach($customImages[2] as $image) {
							$zip->addFile( 'images/gallery/'. $image, 'images/' . $image );
						}
					}
					$page_style = preg_replace('#(\./)?(sections/[\w/_()-]*/images|images/gallery)#im', '../images', $page_style);
                    
					$zip->addFromString(
						'css/' . $page->page_name . '.css'
						, $page_style
					);
					$includePajeStyle .= "\n\t\t<link rel=\"stylesheet\" href=\"css/".$page->page_name.".css\" />";
				}

				$includePajeJs = '';
				if ($page->js !== '') {
					$zip->addFromString(
						'js/' . $page->page_name . '.js'
						, $page->js
					);
					$includePajeJs .= "\n\t\t<script src=\"js/".$page->page_name.".js\"></script>";
				}

				$preloader = '';
				$preloader_css = '';
				if ($page->preloader !== '') {
					$zip->addFile( 'css/preloader.css', 'css/preloader.css' );
					$preloader = "\n\t".$page->preloader;
					$preloader_css = "\n\t\t<link rel=\"stylesheet\" href=\"css/preloader.css\" />";
				}
				preg_match_all('#(/)?images/gallery/([^"\'\s]*)#i', $preloader, $customImages);
				if (!empty($customImages[2]) && count($customImages[2]) > 0) {
					foreach($customImages[2] as $image) {
						$zip->addFile( 'images/gallery/'. $image, 'images/' . $image );
					}
				}
				$preloader = preg_replace('#(\./)?(sections/[\w/_()-]*/images|images/gallery)#i', 'images', $preloader);

				$head = "\t<head>
		<meta charset=\"UTF-8\">
		<title>$page->title</title>
		<meta name=\"keywords\" content=\"$page->meta_keywords\" />
		<meta name=\"description\" content=\"$page->meta_description\" />
		<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">$fonts".''."$default_css".''."$style_gallery".''."$style_magnific
		<link rel=\"stylesheet\" href=\"css/custom.css\" />".''."$includePajeStyle".''."$preloader_css
	</head>
    <body class=\"".$page->style_options."\">$preloader";

				$custom_js = '';
				if (preg_match('/\w/', $overall_js) || preg_match('/\w/', $data->js_over_all)) {
					$custom_js = "\n\t\t<script src=\"js/custom.js\"></script>";
				}
				$end = "$default_js".''."$js_plugins".''.$custom_js.''."$includePajeJs";

                $content = preg_replace('#\?t=[0-9]*#im', '', $page->content);
                
				preg_match_all('#(/)?images/gallery/([^"\']*)#i', $content, $customImages);
				if (!empty($customImages[2]) && count($customImages[2]) > 0) {
					foreach($customImages[2] as $image) {
						if (preg_match('/(.*)\s2x/i',$image,$img)) {
							$zip->addFile( 'images/gallery/' . $img[1], 'images/' . $img[1] );
						} else {
							$zip->addFile( 'images/gallery/' . $image, 'images/' . $image );
						}
					}
				}
				$content = preg_replace('#(\./)?(sections/[\w/_()-]*/images|images/gallery)#im', 'images', $content);

				preg_match_all('#(mp4|ogv|jpg).*?(/)?(video/(?:gallery/)?)([^"\',]*)#i', $page->content, $customVideo);
				$trigger_video_deflt = false;
//				var_dump($customVideo);die;
				if (!empty($customVideo[4]) && count($customVideo[4]) > 0) {
					foreach ( $customVideo[4] as $key => $video ) {
						if ($customVideo[3][$key] === 'video/' && !$trigger_video_deflt) {
							$zip->addFile( 'video/video_bg.mp4', 'video/video_bg.mp4' );
							$zip->addFile( 'video/video_bg.ogv', 'video/video_bg.ogv' );
							$zip->addFile( 'video/video_bg.jpg', 'video/video_bg.jpg' );
							$trigger_video_deflt = true;
						} else if ($customVideo[4][$key] !== 'video/') {
							preg_match('/\..+/', $video, $type);
							if (empty($type)) {
								$type = '.' . $customVideo[1][$key];
								$zip->addFile( 'video/gallery/' . $video . $type, 'video/' . $video . $type );
//								var_dump('video/gallery/' . $video . $type);die;
							} else {
								$zip->addFile( 'video/gallery/' . $video, 'video/' . $video );
							}
						}
					}
				}
				$content = preg_replace('#(\./)?(video/gallery)#im', 'video', $content);
				$content = preg_replace('#(\sclass="spr-option-[^"]*"|spr-option-[^"]*)#im', '', $content);

				$zip->addFromString(
					$page->page_name . '.html'
					, "<!DOCTYPE html>\n<html lang=\"en\">\n" .$head ."\n". $content ."". $end . "\n\t</body>\n</html>"
				);
			}
		}

		/**
		 * Calling from ajax to get a file that contains website
		 */
		public function Download() {
			$this->_clearTmp();
			$mode = ini_get('magic_quotes_gpc');
			$dataPost = $_POST['data'];
			if ($mode) {
				$dataPost = stripslashes($dataPost);
			}
			$data = json_decode($dataPost);
			$baseFiles = (array) $data->baseFilesForProject;

			$style_gallery = '';
			$style_magnific = '';

			$fonts = '';
			$default_css = '';
			$default_js = '';

			$js_plugins = '';


			$filename = "tmp/" . uniqid() . "_website.zip";
			$zip = new ZipArchive();
			$zip->open($filename, ZipArchive::CREATE);

			if ($data->video_bg) {
				$this->_add_video_bg($baseFiles, $js_plugins);
			}

			if ($data->gallery) {
				$this->_add_gallery($baseFiles, $js_plugins, $style_gallery);
			}

			if ($data->magnific) {
				$this->_add_magnific($baseFiles, $js_plugins, $style_magnific);
			}

			if ($data->form_section) {
				$this->_add_form_section($baseFiles, $data, $zip, $js_plugins);
			}

			if ($data->smooth) {
				$this->_add_smooth($baseFiles, $js_plugins);
			}

			if ($data->parallax) {
				$this->_add_parallax($baseFiles, $js_plugins);
			}

			if ($data->fonts_project && is_array($data->fonts_project)) {
				$this->_add_fonts($data, $zip, $fonts);
			}

			if ($data->aos) {
				$this->_add_aos($baseFiles, $js_plugins);
			}

			foreach ($baseFiles as $key => $value) {
				if ($key !== 'plugins') {
					if ( is_array( $value ) ) {
						foreach ( $value as $fileN ) {
							$zip->addFile( $key . '/' . $fileN, $key . '/' . $fileN );
							if ($key === 'css') {
								$default_css .= "\n\t\t<link rel=\"stylesheet\" href=\"$key/$fileN\" />";
							} elseif ($key === 'js') {
								$default_js .= "\n\t\t<script src=\"$key/$fileN\"></script>";
							}
						}
					}
				} else {
					if ( is_array( $value ) ) {
						foreach ( $value as $plug_path ) {
							$js_plugins .= "\n\t\t<script src=\"$plug_path\"></script>";
						}
					}
				}
			}

			$custom_style = preg_replace('#(\./)?(sections/[\w/_()-]*/images|images/gallery)#im', '../images', $data->style);
			$custom_style = preg_replace('#.font-style-supra (?:\/\*)?(\w*)(?:\*\/)?#im', '$1', $custom_style);
			$zip->addFromString( 'css/custom.css', $custom_style);

			$overall_js = "";

			$this->_add_page($data, $overall_js, $zip, $fonts, $default_css, $style_gallery,
				$style_magnific, $default_js, $js_plugins);

			if (preg_match('/\w/', $overall_js)) {
				$overall_js = "\"use strict\";\n\nwindow.addEventListener('load', function() {\n".$overall_js ."\n});";
			}

			if ( preg_match('/\w/', $data->js_over_all) ) {
				$overall_js .= "\n".$data->js_over_all;
			}

			if (preg_match('/\w/', $overall_js)) {
				$zip->addFromString(
					'js/custom.js'
					, $overall_js
				);
			}




			$zip->close();

			$file_name = basename($filename);

			echo json_encode(array('file' => $file_name));
			exit();
		}

		/**
		 * Calling from ajax to clear folder of tmp
		 */
		public function Delete() {
			$data = $_POST['data'];
			if (preg_match('/[a-z0-9]*_(project|website)\.zip/i', $data)) {
				unlink($this->_base_path.'/tmp/'.$data);
			}
			exit();
		}

		/**
		 * Clearing folder of tmp
		 */
		protected function _clearTmp() {
			$tmp = scandir('tmp/');
			for ( $j = 2; $j < count( $tmp ); $j ++ ) {
				if (preg_match('/[a-z0-9]*_(project|website)\.zip/i', $tmp[ $j ])) {
					unlink('tmp/'.$tmp[ $j ]);
				}
			}
		}
	}

	header('Access-Control-Allow-Origin: *');
	define('SUPRA_BASE_PATH', __DIR__);
	$ajax = new Request();
	if (preg_match('/[a-z]+/i', $_GET['mode'])) {
		$function = $_GET['mode'];
		if (method_exists($ajax, ucfirst($function))) {
			$ajax->{ucfirst($function)}();
		}
	}