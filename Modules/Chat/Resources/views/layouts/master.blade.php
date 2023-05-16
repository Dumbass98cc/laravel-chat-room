<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Module Chat</title>

        {{-- Laravel Mix - CSS File --}}
        <link rel="stylesheet" href="{{ mix('css/chat.css') }}">
        <link rel="stylesheet" href="{{ mix('css/app.css') }}">

        @if(Auth::user())
            <link href="{{ url('/css/chat.css') }}" rel="stylesheet">
            <script>
                window.user_id = {{Auth::user()->id}};
                window.user_name = "{{Auth::user()->name}}";
            </script>
        @endif
    </head>
    <body>
        @yield('content')

        {{-- Laravel Mix - JS File --}}
         <script src="{{ mix('js/chat.js') }}"></script>
    </body>
</html>
