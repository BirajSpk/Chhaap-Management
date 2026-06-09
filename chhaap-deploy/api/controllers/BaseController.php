<?php

abstract class BaseController {
    abstract public function handle(string $method, ?string $id, ?string $action): mixed;
}
