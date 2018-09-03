<?php

namespace Vendor\WirelessCharger\Tests;

use Vendor\WirelessCharger\WirelessChargerServiceProvider;
use Orchestra\Testbench\TestCase;

abstract class PackageTestCase extends TestCase
{

    protected function getPackageProviders($app)
    {
        return [WirelessChargerServiceProvider::class];
    }
}
