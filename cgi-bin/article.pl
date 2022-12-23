#!/usr/bin/perl

use DBI;
use CGI;
use strict;
use warnings;

# recibimos parametros
my $q = CGI->new;
my $owner = $q->param("usuario");
my $titulo = $q->param("titulo");

#conectamos base de datos
my $user = 'alumno';
my $password = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.6";
my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");

my $sth = $dbh->prepare("SELECT markdown FROM Articles WHERE owner=? AND title=?");
$sth->execute($owner,$titulo);
my @row = $sth->fetchrow_array;

print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";

if (!(@row == 0)){
	# si existe una pagina con el usuario y titulo dado...
	$sth->finish;

	print "<article>";
    print "<owner> $owner </owner>";
	print "<tittle> $titulo </tittle>";
	print "<text> @row </text>";
	print "</article>";
}
else {
	print "<article>";
    print "<owner></owner>";
	print "<tittle></tittle>";
	print "<text></text>";
	print "</article>";
	
}
$dbh->disconnect;
