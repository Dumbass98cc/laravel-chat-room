<?php

namespace Modules\Chat\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Modules\Chat\Events\ChatMessage;
use Modules\Chat\Http\Requests\MessageRequest;
use Modules\User\Entities\User;

class ChatController extends Controller
{
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * @param MessageRequest $request
     * @return true
     */
    public function sendMessage(MessageRequest $request)
    {
        $user = Auth::user();
        $message = [
            'id' => $request->user_id,
            'source_user_id' => $user->id,
            'name' => $user->name,
            'message' => $request->get('message'),
            'socket' => ['socket_id' => $request->get('socket_id')],
        ];

        event(new ChatMessage($message));
        return true;
    }

    /**
     * Display a listing of the resource.
     * @return Renderable
     */
    public function index()
    {
        $users = User::take(10)->get();
        return view('chat::index', ['users' => $users]);
    }
}
