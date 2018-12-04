<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="{{ asset('public/css/print.css') }}">
		<title></title>
		@yield('css')
	</head>
	<body>
		<div class="content">
			@yield('content')
		</div>
	</body>
</html>