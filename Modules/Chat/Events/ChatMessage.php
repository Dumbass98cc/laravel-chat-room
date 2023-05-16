<?php

namespace Modules\Chat\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var array
     */
    public $message;

    /**
     * Create a new event instance.
     *
     * @param array $message
     */
    public function __construct(array $message)
    {
        $this->message = $message;
        $this->socket = $message['socket'];
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return Channel
     */
    public function broadcastOn()
    {
        return new Channel('chat-message-' . $this->message['id']);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'ChatMessage';
    }
}
